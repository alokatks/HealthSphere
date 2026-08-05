package com.healthsphere.healthsphere.security;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Basic per-IP, per-endpoint rate limiter for the two public, unauthenticated
 * auth endpoints that are otherwise unthrottled: /api/auth/login and
 * /api/auth/forgot-password. In-memory only (no new dependency, no Redis) —
 * fine for a single-instance deployment; if this app is ever scaled to
 * multiple instances behind a load balancer, this should move to a shared
 * store (e.g. Redis) since each instance would otherwise track its own count.
 *
 * Limits are intentionally generous (not a security-grade throttle) — the
 * goal is to blunt naive brute-force/spam scripts, not to replace proper
 * account lockout or CAPTCHA if that's ever needed.
 */
@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private static final int MAX_REQUESTS_PER_WINDOW = 10;
    private static final long WINDOW_MILLIS = 60_000; // 1 minute

    private static class Window {
        volatile long windowStart = System.currentTimeMillis();
        final AtomicInteger count = new AtomicInteger(0);
    }

    private final Map<String, Window> requestWindows = new ConcurrentHashMap<>();

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return !("/api/auth/login".equals(path) || "/api/auth/forgot-password".equals(path));
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String key = request.getRequestURI() + "|" + request.getRemoteAddr();
        Window window = requestWindows.computeIfAbsent(key, k -> new Window());

        boolean limited;
        synchronized (window) {
            long now = System.currentTimeMillis();
            if (now - window.windowStart > WINDOW_MILLIS) {
                window.windowStart = now;
                window.count.set(0);
            }
            limited = window.count.incrementAndGet() > MAX_REQUESTS_PER_WINDOW;
        }

        if (limited) {
            response.setStatus(429); // Too Many Requests
            response.setContentType("application/json");
            response.getWriter().write(
                    "{\"message\":\"Too many requests. Please try again in a minute.\",\"status\":429}");
            return;
        }

        filterChain.doFilter(request, response);
    }
}

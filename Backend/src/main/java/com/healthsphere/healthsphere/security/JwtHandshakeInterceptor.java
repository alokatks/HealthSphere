package com.healthsphere.healthsphere.security;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import com.healthsphere.healthsphere.model.User;
import com.healthsphere.healthsphere.repository.UserRepository;

/**
 * Authenticates the WebSocket handshake using the same JWTs issued at
 * login. Browsers can't set a custom Authorization header on a WS upgrade
 * request, so the token is passed as a query parameter instead, e.g.
 * {@code wss://host/ws?token=<jwt>}.
 *
 * On success, the authenticated user's id and email are stored as session
 * attributes so {@link com.healthsphere.healthsphere.websocket.WebSocketHandler}
 * can route messages to a specific user instead of broadcasting to
 * everyone connected. On failure, the handshake is rejected with 401
 * before any WebSocketSession is created.
 */
@Component
public class JwtHandshakeInterceptor implements HandshakeInterceptor {

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserRepository userRepository;

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                    WebSocketHandler wsHandler, Map<String, Object> attributes) {
        if (!(request instanceof ServletServerHttpRequest servletRequest)) {
            response.setStatusCode(HttpStatus.BAD_REQUEST);
            return false;
        }

        String token = servletRequest.getServletRequest().getParameter("token");
        if (token == null || !tokenProvider.validateToken(token)) {
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            return false;
        }

        String email = tokenProvider.getUsernameFromToken(token);
        User user = userRepository.findByEmail(email);
        if (user == null) {
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            return false;
        }

        attributes.put("userId", user.getId());
        attributes.put("email", user.getEmail());
        return true;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                WebSocketHandler wsHandler, Exception exception) {
        // No post-handshake bookkeeping needed.
    }
}

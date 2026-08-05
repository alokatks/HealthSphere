package com.healthsphere.healthsphere.websocket;

import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

/**
 * Authenticated, per-user WebSocket endpoint. JwtHandshakeInterceptor
 * verifies the JWT before a session is ever created and stores the
 * caller's userId as a session attribute; this handler uses that to keep
 * a userId -> sessions map, so messages can be routed to one user instead
 * of broadcast to every connected client.
 *
 * Nothing currently calls sendToUser() — it's here so other services
 * (e.g. NotificationService) can push real-time updates once there's a
 * concrete use case. Inbound client messages are logged only; there's no
 * broadcast-to-everyone behavior anymore since no legitimate use case for
 * it was identified.
 */
@Component
public class WebSocketHandler extends TextWebSocketHandler {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketHandler.class);

    private final Map<Long, Set<WebSocketSession>> sessionsByUserId = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        Long userId = getUserId(session);
        if (userId == null) {
            session.close(CloseStatus.NOT_ACCEPTABLE);
            return;
        }
        sessionsByUserId
                .computeIfAbsent(userId, id -> Collections.synchronizedSet(new HashSet<>()))
                .add(session);
        logger.info("WebSocket connection established for userId {} ({})", userId, session.getId());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        Long userId = getUserId(session);
        if (userId != null) {
            Set<WebSocketSession> sessions = sessionsByUserId.get(userId);
            if (sessions != null) {
                sessions.remove(session);
                if (sessions.isEmpty()) {
                    sessionsByUserId.remove(userId);
                }
            }
        }
        logger.info("WebSocket connection closed for userId {} ({})", userId, session.getId());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
        // No client-to-client messaging use case exists today, so inbound
        // messages are just logged rather than broadcast/echoed.
        logger.debug("Message received from userId {} ({}): {}", getUserId(session), session.getId(), message.getPayload());
    }

    /**
     * Pushes a message to every active session belonging to a given user
     * (a user may have more than one tab/device open). Silently no-ops if
     * the user has no open session. Intended for server-initiated pushes,
     * e.g. NotificationService notifying a user in real time.
     */
    public void sendToUser(Long userId, String payload) {
        Set<WebSocketSession> sessions = sessionsByUserId.get(userId);
        if (sessions == null) {
            return;
        }
        TextMessage message = new TextMessage(payload);
        synchronized (sessions) {
            for (WebSocketSession session : sessions) {
                if (session.isOpen()) {
                    try {
                        session.sendMessage(message);
                    } catch (IOException e) {
                        logger.warn("Failed to send WebSocket message to userId {} ({}): {}", userId, session.getId(), e.getMessage());
                    }
                }
            }
        }
    }

    private Long getUserId(WebSocketSession session) {
        Object userId = session.getAttributes().get("userId");
        return userId instanceof Long ? (Long) userId : null;
    }
}

package com.healthsphere.healthsphere.notification;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.healthsphere.healthsphere.model.Notification;
import com.healthsphere.healthsphere.model.User;
import com.healthsphere.healthsphere.repository.NotificationRepository;
import com.healthsphere.healthsphere.repository.UserRepository;
import com.healthsphere.healthsphere.websocket.WebSocketHandler;

@Service
public class NotificationService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WebSocketHandler webSocketHandler;

    public Notification createNotification(Long userId, String message) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            Notification notification = new Notification();
            notification.setUser(userOpt.get());
            notification.setMessage(message);
            notification.setTimestamp(LocalDateTime.now());
            notification.setRead(false);
            Notification saved = notificationRepository.save(notification);
            // Best-effort real-time push; the notification is already
            // persisted, so a user with no open WebSocket session (or a
            // send failure) still sees it next time they poll/fetch.
            webSocketHandler.sendToUser(userId, message);
            return saved;
        }
        throw new IllegalArgumentException("User not found.");
    }
    
    // This is the method the controller will call
    public List<Notification> getNotificationsForUser(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            return notificationRepository.findByUser(userOpt.get());
        }
        throw new IllegalArgumentException("User not found.");
    }

    // New: persists read state. Ownership is checked in the controller,
    // same pattern as getUserNotifications/getNotificationsForUser above.
    public Notification markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found."));
        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        message.setFrom(fromEmail); // This dynamically uses the email from properties

        mailSender.send(message);
    }
}


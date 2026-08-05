package com.healthsphere.healthsphere.controller;

import com.healthsphere.healthsphere.model.Notification;
import com.healthsphere.healthsphere.model.User;
import com.healthsphere.healthsphere.notification.NotificationService; // This is the corrected import
import com.healthsphere.healthsphere.repository.NotificationRepository;
import com.healthsphere.healthsphere.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @PreAuthorize("hasAnyRole('PATIENT', 'DOCTOR')")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getUserNotifications(@PathVariable Long userId, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            User targetUser = userRepository.findById(userId).orElse(null);
            if (targetUser == null || !userDetails.getUsername().equals(targetUser.getEmail())) {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN); // Users can only view their own notifications
            }
            List<Notification> notifications = notificationService.getNotificationsForUser(userId);
            return new ResponseEntity<>(notifications, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PreAuthorize("hasAnyRole('PATIENT', 'DOCTOR')")
    @PatchMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Notification existing = notificationRepository.findById(id).orElse(null);
            if (existing == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            if (!userDetails.getUsername().equals(existing.getUser().getEmail())) {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN); // Users can only mark their own notifications as read
            }
            Notification updated = notificationService.markAsRead(id);
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
package org.fleetassistant.backend.notification.controller;

import lombok.RequiredArgsConstructor;
import org.fleetassistant.backend.dto.Notification;
import org.fleetassistant.backend.notification.aws.SqsProducer;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/notification")
public class NotificationController {
    private final SqsProducer sqsProducer;

    @GetMapping
    public ResponseEntity<Void> sendNotification(Notification notification) {
        try {
            sqsProducer.send(notification);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}


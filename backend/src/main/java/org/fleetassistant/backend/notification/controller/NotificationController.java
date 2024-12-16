package org.fleetassistant.backend.notification.controller;

import lombok.RequiredArgsConstructor;
import org.fleetassistant.backend.dto.Notification;
import org.fleetassistant.backend.dto.NotificationRequest;
import org.fleetassistant.backend.notification.service.NotificationService;
import org.fleetassistant.backend.notification.aws.SqsProducer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/notification")
public class NotificationController {
    private final SqsProducer sqsProducer;
    private final NotificationService notificationService;

    @PostMapping
    public ResponseEntity<Void> sendNotification(@RequestBody NotificationRequest notificationRequest) {
        try {
            sqsProducer.send(notificationRequest);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<Page<Notification>> getUserNotifications(@PageableDefault Pageable pageable) {
        return ResponseEntity.ok(notificationService.getUserNotifications(pageable));
    }
}


package org.fleetassistant.backend.notification.service;

import lombok.RequiredArgsConstructor;
import org.fleetassistant.backend.auth.credentials.CredentialsService;
import org.fleetassistant.backend.exceptionhandler.rest.WrongAuthenticationInstanceException;
import org.fleetassistant.backend.notification.repository.NotificationRepository;
import org.fleetassistant.backend.utils.EntityToDtoMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final EntityToDtoMapper entityToDtoMapper;
    public Page<org.fleetassistant.backend.dto.Notification> getUserNotifications(Pageable pageable) {
        var credentials = CredentialsService.getCredentials();
        if(credentials == null) {
            throw new WrongAuthenticationInstanceException("Invalid credentials");
        }
        return notificationRepository.findAllByUserId(credentials.getId(), pageable).map(entityToDtoMapper::notificationToNotificationDto);
    }
}

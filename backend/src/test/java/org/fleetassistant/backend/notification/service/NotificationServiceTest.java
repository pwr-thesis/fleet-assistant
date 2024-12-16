package org.fleetassistant.backend.notification.service;

import org.fleetassistant.backend.auth.credentials.CredentialsService;
import org.fleetassistant.backend.dto.Notification;
import org.fleetassistant.backend.exceptionhandler.rest.WrongAuthenticationInstanceException;
import org.fleetassistant.backend.notification.repository.NotificationRepository;
import org.fleetassistant.backend.utils.EntityToDtoMapper;
import org.fleetassistant.backend.auth.credentials.model.Credentials;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private EntityToDtoMapper entityToDtoMapper;

    @InjectMocks
    private NotificationService notificationService;

    private Credentials credentials;
    private Notification notificationDto;
    private org.fleetassistant.backend.notification.model.Notification notificationEntity;

    @BeforeEach
    void setUpSecurityContext() {
        var credentials = new Credentials();
        credentials.setId(1L); // Example credentials

        var authentication = new UsernamePasswordAuthenticationToken(credentials, null);
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }


    @BeforeEach
    void setUp() {
        credentials = Credentials.builder()
                .id(1L)
                .email("user@example.com")
                .build();

        notificationEntity = org.fleetassistant.backend.notification.model.Notification.builder()
                .id(1L)
                .message("Test notification")
                .build();

        notificationDto = Notification.builder()
                .title("Test title")
                .message("Test notification")
                .build();
    }

    @Test
    void getUserNotifications_success() {
        try (MockedStatic<CredentialsService> mockedStatic = mockStatic(CredentialsService.class)) {
            // Given
            mockedStatic.when(CredentialsService::getCredentials).thenReturn(credentials);
            Pageable pageable = PageRequest.of(0, 10);
            Page<org.fleetassistant.backend.notification.model.Notification> notificationEntities = new PageImpl<>(List.of(notificationEntity));

            when(notificationRepository.findAllByUserId(credentials.getId(), pageable)).thenReturn(notificationEntities);
            when(entityToDtoMapper.notificationToNotificationDto(notificationEntity)).thenReturn(notificationDto);

            // When
            Page<Notification> notifications = notificationService.getUserNotifications(pageable);

            // Then
            assertNotNull(notifications);
            assertEquals(1, notifications.getTotalElements());
            assertEquals(notificationDto, notifications.getContent().getFirst());
            verify(notificationRepository).findAllByUserId(credentials.getId(), pageable);
        }
    }

    @Test
    void getUserNotifications_noCredentials_throwsException() {
        try (MockedStatic<CredentialsService> mockedStatic = mockStatic(CredentialsService.class)) {
            // Given
            mockedStatic.when(CredentialsService::getCredentials).thenReturn(null);
            Pageable pageable = PageRequest.of(0, 10);

            // When
            WrongAuthenticationInstanceException exception = assertThrows(
                    WrongAuthenticationInstanceException.class,
                    () -> notificationService.getUserNotifications(pageable)
            );

            // Then
            assertEquals("Invalid credentials", exception.getMessage());
            verifyNoInteractions(notificationRepository);
        }
    }
}

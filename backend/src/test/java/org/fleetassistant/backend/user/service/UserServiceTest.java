package org.fleetassistant.backend.user.service;

import org.fleetassistant.backend.exceptionhandler.rest.NoSuchObjectException;
import org.fleetassistant.backend.user.model.Manager;
import org.fleetassistant.backend.user.repository.UserRepository;
import org.fleetassistant.backend.utils.Constants;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private Manager manager;

    @BeforeEach
    void setUp() {
        manager = Manager.builder()
                .id(1L)
                .name("John")
                .surname("Doe")
                .build();
    }

    @Test
    void getUserByEmail_success() {
        // Given
        String email = "johndoe@example.com";
        when(userRepository.findByCredentials_Email(email)).thenReturn(Optional.of(manager));
        // When
        Manager foundManager = (Manager) userService.getUserByEmail(email);
        // Then
        assertNotNull(foundManager);
        assertEquals(manager.getId(), foundManager.getId());
        assertEquals(manager.getName(), foundManager.getName());
        verify(userRepository).findByCredentials_Email(email);
    }

    @Test
    void getUserByEmail_userNotFound_throwsException() {
        // Given
        String email = "johndoe@example.com";
        when(userRepository.findByCredentials_Email(email)).thenReturn(Optional.empty());
        // When
        NoSuchObjectException exception = assertThrows(NoSuchObjectException.class, () -> {
            userService.getUserByEmail(email);
        });
        // Then
        assertEquals(Constants.USER_DOESNT_EXIST, exception.getMessage());
        verify(userRepository).findByCredentials_Email(email);
    }
}

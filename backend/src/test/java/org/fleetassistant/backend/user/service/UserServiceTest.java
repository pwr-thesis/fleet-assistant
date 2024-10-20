package org.fleetassistant.backend.user.service;

import org.fleetassistant.backend.auth.credentials.model.Credentials;
import org.fleetassistant.backend.auth.credentials.model.Role;
import org.fleetassistant.backend.dto.User;
import org.fleetassistant.backend.exceptionhandler.rest.NoSuchObjectException;
import org.fleetassistant.backend.user.model.Manager;
import org.fleetassistant.backend.user.repository.UserRepository;
import org.fleetassistant.backend.utils.Constants;
import org.fleetassistant.backend.utils.EntityToDtoMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private EntityToDtoMapper entityToDtoMapper;

    @InjectMocks
    private UserService userService;

    private Credentials credentials;
    private Manager manager;
    private User user;

    @BeforeEach
    void setUp() {
        credentials = Credentials.builder()
                .email("test@example.com")
                .password("password123")
                .role(Role.MANAGER)
                .build();
        manager = Manager.builder().name("John").surname("Doe").credentials(credentials).build();
        user = User.builder().name("John").surname("Doe").email("test@example.com").role(Role.MANAGER).build();
    }


    @Test
    void getUserByEmail_success() {
        // Given
        String email = "johndoe@example.com";
        when(userRepository.findByCredentials_Email(email)).thenReturn(Optional.of(manager));
        when(entityToDtoMapper.userToUserDto(manager)).thenReturn(user);
        // When
        User foundManager = userService.getUserByEmail(email);
        // Then
        assertNotNull(foundManager);
        assertEquals(manager.getName(), foundManager.name());
        assertEquals(manager.getCredentials().getEmail(), foundManager.email());
        assertEquals(manager.getCredentials().getRole(), foundManager.role());
        verify(userRepository).findByCredentials_Email(email);
    }

    @Test
    void getUserByEmail_userNotFound_throwsException() {
        // Given
        String email = "johndoe@example.com";
        when(userRepository.findByCredentials_Email(email)).thenReturn(Optional.empty());
        // When
        NoSuchObjectException exception = assertThrows(NoSuchObjectException.class, () -> userService.getUserByEmail(email));
        // Then
        assertEquals(Constants.USER_DOESNT_EXIST, exception.getMessage());
        verify(userRepository).findByCredentials_Email(email);
    }
}

package org.fleetassistant.backend.user.service;

import org.fleetassistant.backend.auth.models.RegisterRequest;
import org.fleetassistant.backend.user.model.Manager;
import org.fleetassistant.backend.user.model.User;
import org.fleetassistant.backend.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.oauth2.jwt.Jwt;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ManagerServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ManagerService managerService;

    private Jwt jwt;
    private RegisterRequest request;

    @BeforeEach
    void setUp() {
        jwt = mock(Jwt.class);

        request = RegisterRequest.builder()
                .name("Jane")
                .surname("Doe")
                .number("123456789")
                .build();
    }

    @Test
    void createManager_withJwt_success() {
        // Given
        Manager expectedManager = Manager.builder().name("John").surname("Doe").build();
        when(userRepository.save(any(Manager.class))).thenReturn(expectedManager);

        // When
        User actualManager = managerService.createManager(jwt);

        // Then
        assertEquals(expectedManager, actualManager);
        assertEquals("John", actualManager.getName());
        assertEquals("Doe", actualManager.getSurname());
        verify(userRepository).save(any(Manager.class));
    }

    @Test
    void createManager_withRegisterRequest_success() {
        // Given
        Manager expectedManager = Manager.builder().name("Jane").surname("Doe").phone("123456789").build();
        when(userRepository.save(any(Manager.class))).thenReturn(expectedManager);

        // When
        Manager actualManager = managerService.createManager(request);

        // Then
        assertEquals(expectedManager, actualManager);
        assertEquals("Jane", actualManager.getName());
        assertEquals("Doe", actualManager.getSurname());
        assertEquals("123456789", actualManager.getPhone());
        verify(userRepository).save(any(Manager.class));
    }
}

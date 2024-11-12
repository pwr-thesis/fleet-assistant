package org.fleetassistant.backend.auth.credentials;

import org.fleetassistant.backend.auth.credentials.model.Credentials;
import org.fleetassistant.backend.auth.credentials.model.Role;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CredentialsServiceTest {
    @Mock
    private CredentialsRepository credentialsRepository;

    @InjectMocks
    private CredentialsService credentialsService;

    private Credentials credentials;

    @BeforeEach
    void setUp() {
        credentials = Credentials.builder()
                .email("test@example.com")
                .password("password123")
                .role(Role.MANAGER)
                .build();
    }

    @Test
    void loadUserByUsername_existingUser_returnsUser() {
        // Given
        when(credentialsRepository.findByEmail(anyString())).thenReturn(Optional.of(credentials));
        // When
        Credentials result = credentialsService.loadUserByUsername("test@example.com");
        // Then
        assertNotNull(result);
        assertEquals("test@example.com", result.getEmail());
    }

    @Test
    void loadUserByUsername_nonExistingUser_returnsNull() {
        // Given
        when(credentialsRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        // When
        Credentials result = credentialsService.loadUserByUsername("nonexistent@example.com");
        // Then
        assertNull(result);
    }

    @Test
    void create_withRole_savesAndReturnsCredentials() {
        // Given
        when(credentialsRepository.save(any(Credentials.class))).thenReturn(credentials);
        // When
        Credentials result = credentialsService.create("newuser@example.com", Role.MANAGER);
        // Then
        assertNotNull(result);
        assertEquals("test@example.com", result.getEmail());
    }

    @Test
    void create_withPasswordAndRole_savesAndReturnsCredentials() {
        // Given
        when(credentialsRepository.save(any(Credentials.class))).thenReturn(credentials);
        // When
        Credentials result = credentialsService.create("newuser@example.com", "password123", Role.MANAGER);
        // Then
        assertNotNull(result);
        assertEquals("test@example.com", result.getEmail());
    }

    @Test
    void ifCredentialsExist_existingUser_returnsTrue() {
        // Given
        when(credentialsRepository.findByEmail(anyString())).thenReturn(Optional.of(credentials));
        // When
        boolean result = credentialsService.ifCredentialsExist("test@example.com");
        // Then
        assertTrue(result);
    }

    @Test
    void ifCredentialsExist_nonExistingUser_returnsFalse() {
        // Given
        when(credentialsRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        // When
        boolean result = credentialsService.ifCredentialsExist("nonexistent@example.com");
        // Then
        assertFalse(result);
    }
}
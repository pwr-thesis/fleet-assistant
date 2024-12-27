package org.fleetassistant.backend.auth.credentials;

import org.fleetassistant.backend.auth.credentials.model.Credentials;
import org.fleetassistant.backend.auth.credentials.model.Role;
import org.fleetassistant.backend.exceptionhandler.rest.AccountIsActiveException;
import org.fleetassistant.backend.exceptionhandler.rest.EmailNotFoundException;
import org.fleetassistant.backend.exceptionhandler.rest.InvalidTokenException;
import org.fleetassistant.backend.jwt.model.TokenType;
import org.fleetassistant.backend.jwt.service.JwtService;
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
    @Mock
    private JwtService jwtService;

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
        Credentials result = credentialsService.create("newuser@example.com", Role.MANAGER, true);
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

    @Test
    void activateAccount_validToken_activatesAccount() {
        // Given
        String token = "validToken";
        String email = "test@example.com";

        when(jwtService.extractUsername(token)).thenReturn(email);
        when(jwtService.extractType(token)).thenReturn(TokenType.EMAIL_VALIDATION);
        when(credentialsRepository.findByEmail(email)).thenReturn(Optional.of(credentials));

        credentials.setIsEnabled(false); // Initially disabled

        // When
        credentialsService.activateAccount(token);

        // Then
        assertTrue(credentials.isEnabled());
    }

    @Test
    void activateAccount_invalidTokenType_throwsInvalidTokenException() {
        // Given
        String token = "invalidToken";

        when(jwtService.extractType(token)).thenReturn(TokenType.ACCESS_TOKEN); // Not EMAIL_VALIDATION
        when(jwtService.extractUsername(token)).thenReturn("test@example.com");

        // When / Then
        InvalidTokenException exception = assertThrows(InvalidTokenException.class, () -> {
            credentialsService.activateAccount(token);
        });
        assertEquals("Invalid token", exception.getMessage());
    }

    @Test
    void activateAccount_emptyEmail_throwsInvalidTokenException() {
        // Given
        String token = "emptyEmailToken";

        when(jwtService.extractType(token)).thenReturn(TokenType.EMAIL_VALIDATION);
        when(jwtService.extractUsername(token)).thenReturn(""); // Empty email

        // When / Then
        InvalidTokenException exception = assertThrows(InvalidTokenException.class, () -> {
            credentialsService.activateAccount(token);
        });
        assertEquals("Invalid token", exception.getMessage());
    }

    @Test
    void activateAccount_emailNotFound_throwsEmailNotFoundException() {
        // Given
        String token = "unknownEmailToken";
        String email = "unknown@example.com";

        when(jwtService.extractType(token)).thenReturn(TokenType.EMAIL_VALIDATION);
        when(jwtService.extractUsername(token)).thenReturn(email);
        when(credentialsRepository.findByEmail(email)).thenReturn(Optional.empty()); // Email not found

        // When / Then
        EmailNotFoundException exception = assertThrows(EmailNotFoundException.class, () -> {
            credentialsService.activateAccount(token);
        });
        assertEquals("Email not found", exception.getMessage());
    }

    @Test
    void activateAccount_alreadyActive_throwsAccountIsActiveException() {
        // Given
        String token = "alreadyActiveToken";
        String email = "test@example.com";

        when(jwtService.extractType(token)).thenReturn(TokenType.EMAIL_VALIDATION);
        when(jwtService.extractUsername(token)).thenReturn(email);
        when(credentialsRepository.findByEmail(email)).thenReturn(Optional.of(credentials));

        credentials.setIsEnabled(true); // Already active

        // When / Then
        AccountIsActiveException exception = assertThrows(AccountIsActiveException.class, () -> {
            credentialsService.activateAccount(token);
        });
        assertEquals("Account is already active", exception.getMessage());
    }

}
package org.fleetassistant.backend.auth;

import org.fleetassistant.backend.auth.credentials.CredentialsService;
import org.fleetassistant.backend.auth.credentials.model.Credentials;
import org.fleetassistant.backend.auth.credentials.model.Role;
import org.fleetassistant.backend.auth.models.AuthenticationRequest;
import org.fleetassistant.backend.auth.models.AuthenticationResponse;
import org.fleetassistant.backend.auth.models.RegisterRequest;
import org.fleetassistant.backend.dto.User;
import org.fleetassistant.backend.exceptionhandler.rest.ObjectAlreadyExistsException;
import org.fleetassistant.backend.dto.Token;
import org.fleetassistant.backend.jwt.service.JwtService;
import org.fleetassistant.backend.jwt.service.TokenGenerator;
import org.fleetassistant.backend.user.model.Manager;
import org.fleetassistant.backend.user.service.ManagerService;
import org.fleetassistant.backend.user.service.UserService;
import org.fleetassistant.backend.utils.EntityToDtoMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.fleetassistant.backend.utils.Constants.ALREADY_REGISTERED;
import static org.fleetassistant.backend.utils.Constants.USER_DOESNT_EXIST;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthenticationServiceTest {
    @Mock
    private CredentialsService credentialsService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private TokenGenerator tokenGenerator;

    @Mock
    private JwtService jwtService;

    @Mock
    private ManagerService managerService;

    @Mock
    private UserService userService;

    @Mock
    private EntityToDtoMapper entityToDtoMapper;

    @InjectMocks
    private AuthenticationService authenticationService;

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
    void register_existingUser_throwsException() {
        // Given
        when(credentialsService.ifCredentialsExist("new@example.com")).thenReturn(true);

        // When / Then
        ObjectAlreadyExistsException exception = assertThrows(ObjectAlreadyExistsException.class,
                () -> authenticationService.register(new RegisterRequest("John", "Doe", "new@example.com", "password", "")));
        assertEquals(ALREADY_REGISTERED, exception.getMessage());
    }

    @Test
    void register_newUser_createsAndReturnsAuthenticationResponse() {
        // Given
        when(credentialsService.ifCredentialsExist(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(credentialsService.create(anyString(), anyString(), any(Role.class))).thenReturn(credentials);
        when(managerService.createManager(any(RegisterRequest.class))).thenReturn(manager);
        when(tokenGenerator.createToken(any(Credentials.class))).thenReturn(Token.builder().accessToken("access").build());
        when(entityToDtoMapper.userToUserDto(any(Manager.class))).thenReturn(user);
        // When
        AuthenticationResponse response = authenticationService.register(new RegisterRequest("John", "Doe", "new@example.com", "password", ""));

        // Then
        assertNotNull(response);
        assertEquals("access", response.getToken().accessToken());
        assertEquals("John", response.getUser().name());
        assertEquals("Doe", response.getUser().surname());
        assertEquals(Role.MANAGER, response.getUser().role());
        assertEquals("test@example.com", response.getUser().email());
    }

    @Test
    void authenticate_invalidUser_throwsException() {
        // Given
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(null);
        when(credentialsService.loadUserByUsername(anyString())).thenReturn(null);
        // When / Then
        UsernameNotFoundException exception = assertThrows(UsernameNotFoundException.class,
                () -> authenticationService.authenticate(new AuthenticationRequest("invalid@example.com", "password")));
        assertEquals(USER_DOESNT_EXIST, exception.getMessage());
    }

    @Test
    void authenticate_validUser_returnsAuthenticationResponse() {
        // Given
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(null);
        when(credentialsService.loadUserByUsername(anyString())).thenReturn(credentials);
        when(userService.getUserByEmail(anyString())).thenReturn(user);
        when(tokenGenerator.createToken(any(Credentials.class))).thenReturn(Token.builder().accessToken("access").build());
        // When
        AuthenticationResponse response = authenticationService.authenticate(new AuthenticationRequest("valid@example.com", "password"));
        // Then
        assertNotNull(response);
        assertEquals("access", response.getToken().accessToken());
        assertEquals("John", response.getUser().name());
        assertEquals("Doe", response.getUser().surname());
        assertEquals(Role.MANAGER, response.getUser().role());
        assertEquals("test@example.com", response.getUser().email());
    }

    @Test
    void refreshToken_validJwt_returnsNewToken() {
        // Given
        when(jwtService.extractUsername(anyString())).thenReturn("test@example.com");
        when(credentialsService.loadUserByUsername(anyString())).thenReturn(credentials);
        when(tokenGenerator.createAccessToken(any(Credentials.class))).thenReturn("newAccessToken");
        // When
        String newToken = authenticationService.refreshToken("validJwt");
        // Then
        assertEquals("newAccessToken", newToken);
    }
}
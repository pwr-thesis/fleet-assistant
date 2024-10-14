package org.fleetassistant.backend.utils.config.security;

import org.fleetassistant.backend.auth.credentials.CredentialsService;
import org.fleetassistant.backend.auth.credentials.model.Credentials;
import org.fleetassistant.backend.auth.credentials.model.Role;
import org.fleetassistant.backend.user.model.Manager;
import org.fleetassistant.backend.user.service.ManagerService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JwtToUserConverterTest {

    @Mock
    private CredentialsService credentialsService;

    @Mock
    private ManagerService managerService;

    @InjectMocks
    private JwtToUserConverter jwtToUserConverter;

    private Jwt jwt;
    private Credentials credentials;

    @BeforeEach
    void setUp() {
        jwt = mock(Jwt.class);
        when(jwt.getClaim("email")).thenReturn("manager@example.com");
        credentials = Credentials.builder()
                .email("manager@example.com")
                .role(Role.MANAGER)
                .build();
    }

    @Test
    void convert_existingUser_success() {
        // Given
        when(credentialsService.loadUserByUsername("manager@example.com")).thenReturn(credentials);
        // When
        UsernamePasswordAuthenticationToken authToken = jwtToUserConverter.convert(jwt);
        // Then
        assertNotNull(authToken);
        assertEquals(credentials, authToken.getPrincipal());
        assertEquals(jwt, authToken.getCredentials());
        assertEquals(1, authToken.getAuthorities().size());
        assertTrue(authToken.getAuthorities().stream().map(GrantedAuthority::getAuthority).anyMatch(auth -> auth.equals("MANAGER")));

        verify(credentialsService).loadUserByUsername("manager@example.com");
        verify(managerService, never()).createManager(any(Jwt.class));
    }

    @Test
    void convert_newUser_success() {
        // Given
        when(credentialsService.loadUserByUsername("manager@example.com")).thenReturn(null);
        when(credentialsService.create("manager@example.com", Role.MANAGER)).thenReturn(credentials);
        Manager manager = Manager.builder().name("John").surname("Doe").build();
        when(managerService.createManager(jwt)).thenReturn(manager);
        // When
        UsernamePasswordAuthenticationToken authToken = jwtToUserConverter.convert(jwt);
        // Then
        assertNotNull(authToken);
        assertEquals(credentials, authToken.getPrincipal());
        assertEquals(jwt, authToken.getCredentials());
        assertEquals(1, authToken.getAuthorities().size());
        assertTrue(authToken.getAuthorities().stream().map(GrantedAuthority::getAuthority).anyMatch(auth -> auth.equals("MANAGER")));
        verify(credentialsService).loadUserByUsername("manager@example.com");
        verify(credentialsService).create("manager@example.com", Role.MANAGER);
        verify(managerService).createManager(jwt);
    }
}
package org.fleetassistant.backend.utils.config.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.fleetassistant.backend.exceptionhandler.rest.AuthException;
import org.fleetassistant.backend.utils.config.security.decoders.CustomJwtDecoder;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomAuthFilterTest {
    @Mock
    private CustomJwtDecoder decoder;
    @Mock
    private JwtDecoder oauthTokenDecoder;

    @Mock
    private JwtToUserConverter jwtToUserConverter;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private FilterChain filterChain;

    @InjectMocks
    private CustomAuthFilter customAuthFilter;

    @BeforeEach
    void setUp() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void shouldSetAuthenticationWhenTokenIsValid() {
        String token = "Bearer valid_token";
        Jwt jwt = mock(Jwt.class);
        UsernamePasswordAuthenticationToken authenticationToken = mock(UsernamePasswordAuthenticationToken.class);

        when(request.getHeader("Authorization")).thenReturn(token);
        when(decoder.decode("valid_token")).thenReturn(jwt);
        when(jwtToUserConverter.convert(jwt)).thenReturn(authenticationToken);

        customAuthFilter.doFilterInternal(request, response, filterChain);

        assertEquals(authenticationToken, SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void shouldReturnUnauthorizedWhenTokenIsInvalid() throws Exception {
        String token = "Bearer invalid_token";
        when(decoder.decode("invalid_token")).thenThrow(new AuthException("Invalid token"));
        when(request.getHeader("Authorization")).thenReturn(token);

        customAuthFilter.doFilterInternal(request, response, filterChain);

        verify(response).setStatus(HttpStatus.UNAUTHORIZED.value());
        verify(filterChain, never()).doFilter(request, response);
    }

    @Test
    void shouldProceedWithoutAuthenticationWhenAuthorizationHeaderIsMissing() throws Exception {
        when(request.getHeader("Authorization")).thenReturn(null);

        customAuthFilter.doFilterInternal(request, response, filterChain);

        assertNull(SecurityContextHolder.getContext().getAuthentication());
        verify(filterChain).doFilter(request, response);
    }
}
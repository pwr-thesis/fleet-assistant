package org.fleetassistant.backend.jwt.service;

import org.fleetassistant.backend.auth.credentials.model.Credentials;
import org.fleetassistant.backend.exceptionhandler.rest.CacheException;
import org.fleetassistant.backend.jwt.TokenDTO;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TokenGeneratorTest {
    @Mock
    private CacheManager cacheManager;

    @Mock
    private JwtService jwtService;

    @Mock
    private Cache accessTokenCache;

    @Mock
    private Cache refreshTokenCache;

    @InjectMocks
    private TokenGenerator tokenGenerator;

    @Test
    void createAccessToken_success_createsAndCachesToken() {
        // Given
        Credentials credentials = mock(Credentials.class);
        when(credentials.getId()).thenReturn(123L);
        when(jwtService.createSignedJwt(any(), any())).thenReturn("accessToken");
        when(cacheManager.getCache("accessTokens")).thenReturn(accessTokenCache);
        // When
        String token = tokenGenerator.createAccessToken(credentials);
        // Then
        assertEquals("accessToken", token);
        verify(accessTokenCache).put(123L, "accessToken");
    }

    @Test
    void createAccessToken_cacheNotFound_throwsException() {
        // Given
        Credentials credentials = mock(Credentials.class);
        when(credentials.getId()).thenReturn(123L);
        when(jwtService.createSignedJwt(any(), any())).thenReturn("accessToken");
        when(cacheManager.getCache("accessTokens")).thenReturn(null);
        // When / Then
        CacheException exception = assertThrows(CacheException.class, () -> tokenGenerator.createAccessToken(credentials));
        assertEquals("Cache not found", exception.getMessage());
    }

    @Test
    void createRefreshToken_success_createsAndCachesToken() {
        // Given
        Credentials credentials = mock(Credentials.class);
        when(credentials.getId()).thenReturn(123L);
        when(jwtService.createSignedJwt(any(), any())).thenReturn("refreshToken");
        when(cacheManager.getCache("refreshTokens")).thenReturn(refreshTokenCache);
        // When
        String token = tokenGenerator.createRefreshToken(credentials);
        // Then
        assertEquals("refreshToken", token);
        verify(refreshTokenCache).put(123L, "refreshToken");
    }

    @Test
    void createRefreshToken_cacheNotFound_throwsException() {
        // Given
        Credentials credentials = mock(Credentials.class);
        when(credentials.getId()).thenReturn(123L);
        when(jwtService.createSignedJwt(any(), any())).thenReturn("refreshToken");
        when(cacheManager.getCache("refreshTokens")).thenReturn(null);
        // When / Then
        CacheException exception = assertThrows(CacheException.class, () -> tokenGenerator.createRefreshToken(credentials));
        assertEquals("Cache not found", exception.getMessage());
    }

    @Test
    void createToken_success_createsAccessAndRefreshToken() {
        // Given
        Credentials credentials = mock(Credentials.class);
        when(credentials.getId()).thenReturn(123L);
        when(jwtService.createSignedJwt(any(), any())).thenReturn("accessToken", "refreshToken");
        when(cacheManager.getCache(anyString())).thenReturn(Mockito.mock(Cache.class));
        // When
        TokenDTO tokenDTO = tokenGenerator.createToken(credentials);
        // Then
        assertNotNull(tokenDTO);
        assertEquals(123L, tokenDTO.getUserId());
        assertEquals("accessToken", tokenDTO.getAccessToken());
        assertEquals("refreshToken", tokenDTO.getRefreshToken());
    }

    @Test
    void createValidationToken_success_createsValidationToken() {
        // Given
        Credentials credentials = mock(Credentials.class);
        when(jwtService.createSignedJwt(any(), any())).thenReturn("validationToken");
        // When
        String validationToken = tokenGenerator.createValidationToken(credentials);
        // Then
        assertEquals("validationToken", validationToken);
    }
}
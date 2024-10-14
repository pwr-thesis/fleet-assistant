package org.fleetassistant.backend.jwt.service;

import io.jsonwebtoken.Claims;
import org.fleetassistant.backend.exceptionhandler.nonrest.IncorrectTokenTypeException;
import org.fleetassistant.backend.utils.Constants;
import org.fleetassistant.backend.utils.config.security.KeyService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;

import java.security.Key;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JwtServiceTest {

    @Mock
    private CacheManager cacheManager;

    @Mock
    private KeyService keyService;

    private final Cache cache = Mockito.mock(Cache.class);

    @Mock
    private Key key;

    @InjectMocks
    @Spy
    private JwtService jwtService;

    private static final String TOKEN = "test.Token.test";
    private static final long USER_ID = 1L;

    @Test
    void extractUsername_validToken_shouldReturnUsername() {
        // Given
        Claims claims = mock(Claims.class);
        when(claims.getSubject()).thenReturn("testUser");
        doReturn(claims).when(jwtService).extractAllClaims(TOKEN);

        // When
        String username = jwtService.extractUsername(TOKEN);

        // Then
        assertEquals("testUser", username);
    }

    @Test
    void invalidateTokenIfExist_accessTokenExists_shouldAddToBlacklist() throws IncorrectTokenTypeException {
        // Given
        when(cacheManager.getCache(Constants.ACCESS_TOKENS)).thenReturn(cache);
        when(cache.get(USER_ID)).thenReturn(() -> TOKEN);

        Cache blackListCache = mock(Cache.class);
        when(cacheManager.getCache(Constants.BLACK_LIST)).thenReturn(blackListCache);
        when(blackListCache.get(USER_ID)).thenReturn(null);

        // When
        jwtService.invalidateTokenIfExist(USER_ID, TokenType.ACCESS_TOKEN);

        // Then
        verify(cacheManager, times(1)).getCache(Constants.ACCESS_TOKENS);
        verify(cache, times(1)).get(USER_ID);
        verify(cacheManager, times(1)).getCache(Constants.BLACK_LIST);
        verify(blackListCache, times(1)).put(eq(USER_ID), anyList()); // Ensure token is added to blacklist
    }

    @Test
    void addTokenToBlackList_shouldAddTokenToCache() throws IncorrectTokenTypeException {
        // Given
        Cache accessTokenCache = mock(Cache.class);
        Cache blackListCache = mock(Cache.class);

        when(cacheManager.getCache(Constants.ACCESS_TOKENS)).thenReturn(accessTokenCache);
        when(cacheManager.getCache(Constants.BLACK_LIST)).thenReturn(blackListCache);
        when(accessTokenCache.get(USER_ID)).thenReturn(() -> TOKEN);

        // When
        jwtService.invalidateTokenIfExist(USER_ID, TokenType.ACCESS_TOKEN);

        // Then
        verify(cacheManager).getCache(Constants.ACCESS_TOKENS);
        verify(accessTokenCache).get(USER_ID);
        verify(cacheManager).getCache(Constants.BLACK_LIST);
        verify(blackListCache).put(eq(USER_ID), anyList());
    }
}
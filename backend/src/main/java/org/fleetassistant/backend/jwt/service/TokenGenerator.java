package org.fleetassistant.backend.jwt.service;

import lombok.RequiredArgsConstructor;
import org.fleetassistant.backend.auth.credentials.model.Credentials;
import org.fleetassistant.backend.exceptionhandler.rest.CacheException;
import org.fleetassistant.backend.jwt.model.TokenDTO;
import org.fleetassistant.backend.jwt.model.TokenType;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Component;

import static org.fleetassistant.backend.utils.Constants.*;


@Component
@RequiredArgsConstructor
public class TokenGenerator {
    private final CacheManager cacheManager;
    private final JwtService jwtService;

    public String createAccessToken(Credentials credentials) {
        jwtService.invalidateTokenIfExist(credentials.getId(), TokenType.ACCESS_TOKEN);
        String jwt = jwtService.createSignedJwt(credentials, TokenType.ACCESS_TOKEN);
        return putTokenInCache(ACCESS_TOKENS, credentials, jwt);
    }

    public String createRefreshToken(Credentials credentials) {
        jwtService.invalidateTokenIfExist(credentials.getId(), TokenType.REFRESH_TOKEN);
        String jwt = jwtService.createSignedJwt(credentials, TokenType.REFRESH_TOKEN);
        return putTokenInCache(REFRESH_TOKENS, credentials, jwt);
    }

    public TokenDTO createToken(Credentials credentials) {
        return TokenDTO.builder()
                .userId(credentials.getId())
                .accessToken(createAccessToken(credentials))
                .refreshToken(createRefreshToken(credentials)).build();
    }

    private String putTokenInCache(String refreshTokens, Credentials credentials, String jwt) {
        var cache = cacheManager.getCache(refreshTokens);
        if (cache == null) throw new CacheException(CACHE_NOT_FOUND);
        cache.put(credentials.getId(), jwt);
        return jwt;
    }

    public String createValidationToken(Credentials credentials) {
        return jwtService.createSignedJwt(credentials, TokenType.EMAIL_VALIDATION);
    }
}
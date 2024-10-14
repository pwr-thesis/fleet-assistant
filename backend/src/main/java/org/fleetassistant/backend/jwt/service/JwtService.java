package org.fleetassistant.backend.jwt.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwsHeader;
import io.jsonwebtoken.Jwts;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.fleetassistant.backend.auth.credentials.model.Credentials;
import org.fleetassistant.backend.exceptionhandler.nonrest.IncorrectTokenTypeException;
import org.fleetassistant.backend.exceptionhandler.rest.InvalidTokenException;
import org.fleetassistant.backend.exceptionhandler.rest.TokenRequiredException;
import org.fleetassistant.backend.utils.config.security.KeyService;
import org.hibernate.cache.CacheException;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.function.Function;

import static org.fleetassistant.backend.utils.Constants.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class JwtService {
    private final CacheManager cacheManager;
    private final KeyService keyService;

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public TokenType extractType(String token) {
        return TokenType.valueOf(extractClaim(token, claims -> claims.get(TYPE, String.class)));
    }

    public long extractId(String token) {
        return extractClaim(token, claims -> claims.get(ID, Long.class));
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(keyService.getSignKey())
                .build().parseClaimsJws(token).getBody();
    }

    public JwsHeader extractAllHeaders(String token) {
        return Jwts.parserBuilder().setSigningKey(keyService.getSignKey())
                .build().parseClaimsJws(token).getHeader();
    }

    public void validateToken(String bearerToken) {
        if (!StringUtils.hasText(bearerToken) ||
                !bearerToken.startsWith(AUTHENTICATION_BEARER_TOKEN))
            throw new TokenRequiredException(TOKEN_NEEDED);
        String jwt = bearerToken.substring(7);
        if (isTokenBanned(jwt))
            throw new InvalidTokenException(TOKEN_HAS_BEEN_BANNED);
        extractAllClaims(jwt);
    }

    public boolean isTokenBanned(String token) {
        final long id = extractId(token);
        Cache blackList = cacheManager.getCache(BLACK_LIST);
        if (blackList == null) {
            throw new CacheException(CACHE_NOT_FOUND);
        }
        var bannedUserTokensCache = blackList.get(id);
        List<String> bannedJwt = (List<String>) (bannedUserTokensCache != null ? bannedUserTokensCache.get() : null);
        if (bannedJwt == null) {
            return false;
        }
        return bannedJwt.stream().anyMatch(o -> o.equals(token));
    }

    public void invalidateTokenIfExist(long userId, TokenType tokenType) throws IncorrectTokenTypeException {
        Cache cache;
        if (tokenType == TokenType.ACCESS_TOKEN) {
            cache = cacheManager.getCache(ACCESS_TOKENS);
        } else if (tokenType == TokenType.REFRESH_TOKEN) {
            cache = cacheManager.getCache(REFRESH_TOKENS);
        } else {
            throw new IncorrectTokenTypeException();
        }
        if (cache == null) throw new CacheException(CACHE_NOT_FOUND);

        var oldTokens = cache.get(userId);

        if (oldTokens != null) {
            String cachedJwt = (String) oldTokens.get();
            addTokenToBlackList(userId, cachedJwt);
        }
    }

    private void addTokenToBlackList(long userId, String cachedJwt) {
        Cache blackList = cacheManager.getCache(BLACK_LIST);
        if (blackList == null) throw new CacheException(CACHE_NOT_FOUND);

        var bannedUserTokensCache = blackList.get(userId);
        List<String> jwtList = new ArrayList<>();
        if (bannedUserTokensCache != null) {
            var bannedTokens = bannedUserTokensCache.get();
            jwtList = bannedTokens == null ? new ArrayList<>() : (List<String>) bannedTokens;
        }
        jwtList.add(cachedJwt);
        blackList.put(userId, jwtList);
    }


    public String createSignedJwt(Credentials user, TokenType tokenType) {
        return Jwts.builder()
                .claim(ID, user.getId())
                .setSubject(user.getUsername())
                .claim(ROLE, user.getRole())
                .claim(EMAIL, user.getEmail())
                .claim(TYPE, tokenType)
                .setIssuedAt(Date.from(Instant.now()))
                .setExpiration(tokenType.getExpiryDate())
                .signWith(keyService.getSignKey()).compact();
    }
}
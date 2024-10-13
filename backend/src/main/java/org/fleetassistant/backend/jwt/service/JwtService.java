package org.fleetassistant.backend.jwt.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.fleetassistant.backend.exceptionhandler.nonrest.CacheError;
import org.fleetassistant.backend.exceptionhandler.nonrest.IncorrectTokenTypeException;
import org.fleetassistant.backend.utils.KeyUtils;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.function.Function;

import static org.fleetassistant.backend.utils.Constants.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class JwtService {
    private final KeyUtils keyUtils;
    private final CacheManager cacheManager;

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public long extractId(String token) {
        return extractClaim(token, claims -> claims.get(ID, Long.class));
    }

    public String extractType(String token) {
        return extractClaim(token, claims -> claims.get(TYPE, String.class));
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(keyUtils.getAccessTokenPublicKey()).build().parseClaimsJws(token).getBody();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String email = extractUsername(token);
        return email.equals(userDetails.getUsername()) && !isTokenBanned(token);
    }

    public boolean isTokenBanned(String token) {
        final long id = extractId(token);
        Cache blackList = cacheManager.getCache(BLACK_LIST);
        if (blackList == null) {
            throw new CacheError(CACHE_NOT_FOUND);
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

        if (cache == null) {
            throw new CacheError(CACHE_NOT_FOUND);
        }

        var oldTokens = cache.get(userId);

        if (oldTokens != null) {
            String cachedJwt = (String) oldTokens.get();
            addTokenToBlackList(userId, cachedJwt);
        }
    }

    private void addTokenToBlackList(long userId, String cachedJwt) {

        Cache blackList = cacheManager.getCache(BLACK_LIST);
        if (blackList == null) {
            throw new CacheError(CACHE_NOT_FOUND);
        }

        var bannedUserTokensCache = blackList.get(userId);
        List<String> jwtList = new ArrayList<>();
        if (bannedUserTokensCache != null) {
            var help = bannedUserTokensCache.get();
            jwtList = help == null ? new ArrayList<>() : (List<String>) help;
        }

        jwtList.add(cachedJwt);
        blackList.put(userId, jwtList);
    }

    public boolean isRefreshToken(String token) {
        return Objects.equals(extractType(token), TokenType.REFRESH_TOKEN.name());
    }
}
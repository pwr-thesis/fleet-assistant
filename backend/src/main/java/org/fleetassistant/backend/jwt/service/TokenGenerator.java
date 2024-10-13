package org.fleetassistant.backend.jwt.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.fleetassistant.backend.auth.credentials.model.Credentials;
import org.fleetassistant.backend.exceptionhandler.nonrest.CacheError;
import org.fleetassistant.backend.exceptionhandler.nonrest.IncorrectTokenTypeException;
import org.fleetassistant.backend.exceptionhandler.rest.WrongAuthenticationInstanceException;
import org.fleetassistant.backend.jwt.TokenDTO;
import org.springframework.cache.CacheManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import static org.fleetassistant.backend.utils.Constants.*;


@Component
@RequiredArgsConstructor
@Slf4j
public class TokenGenerator {
    private final JwtEncoder jwtAccessTokenEncoder;
    private final JwtEncoder jwtRefreshTokenEncoder;
    private final CacheManager cacheManager;
    private final JwtService jwtService;

    private static JwtClaimsSet makeJwtClaimSet(Credentials credentials, TokenType tokenType) {
        Instant now = Instant.now();
        var jwtClaimsSet = JwtClaimsSet.builder()
                .subject(credentials.getEmail())
                .claim(ID, credentials.getId())
                .claim(EMAIL, credentials.getEmail())
                .claim(ROLE, credentials.getRole())
                .issuer("Fleet Assistant")
                .claim(TYPE, tokenType)
                .issuedAt(now);
        if (tokenType == TokenType.ACCESS_TOKEN) {
            return jwtClaimsSet.expiresAt(now.plus(60, ChronoUnit.MINUTES)).build();
        } else if (tokenType == TokenType.REFRESH_TOKEN) {
            return jwtClaimsSet.expiresAt(now.plus(2, ChronoUnit.DAYS)).build();
        }
        throw new IncorrectTokenTypeException();
    }

    public String createAccessToken(Authentication authentication) {
        Credentials user = (Credentials) authentication.getPrincipal();

        try {
            jwtService.invalidateTokenIfExist(user.getId(), TokenType.ACCESS_TOKEN);
        } catch (IncorrectTokenTypeException e) {
            log.error(e.getMessage());
        }

        JwtClaimsSet jwtClaimSet = makeJwtClaimSet(user, TokenType.ACCESS_TOKEN);

        return encodeAndPutJwt(user, jwtClaimSet, jwtAccessTokenEncoder, ACCESS_TOKENS);
    }

    private String encodeAndPutJwt(Credentials user, JwtClaimsSet jwtClaimSet, JwtEncoder jwtAccessTokenEncoder,
                                   String accessTokens) {
        String jwt = jwtAccessTokenEncoder.encode(JwtEncoderParameters.from(jwtClaimSet)).getTokenValue();
        var cache = cacheManager.getCache(accessTokens);
        if (cache == null) {
            throw new CacheError(CACHE_NOT_FOUND);
        }
        cache.put(user.getId(), jwt);
        return jwt;
    }

    public String createRefreshToken(Authentication authentication) {
        Credentials credentials = (Credentials) authentication.getPrincipal();

        try {
            jwtService.invalidateTokenIfExist(credentials.getId(), TokenType.REFRESH_TOKEN);
        } catch (IncorrectTokenTypeException e) {
            log.error(e.getMessage());
        }
        JwtClaimsSet jwtClaimSet = makeJwtClaimSet(credentials, TokenType.REFRESH_TOKEN);

        return encodeAndPutJwt(credentials, jwtClaimSet, jwtRefreshTokenEncoder, REFRESH_TOKENS);
    }

    public TokenDTO createToken(Authentication authentication) {
        if (!(authentication.getPrincipal() instanceof Credentials user)) {
            throw new WrongAuthenticationInstanceException(OTHER_INSTANCE_DETECTED);
        }

        TokenDTO tokenDTO = new TokenDTO();
        tokenDTO.setUserId(user.getId());
        tokenDTO.setAccessToken(createAccessToken(authentication));
        tokenDTO.setRefreshToken(createRefreshToken(authentication));

        return tokenDTO;
    }
}
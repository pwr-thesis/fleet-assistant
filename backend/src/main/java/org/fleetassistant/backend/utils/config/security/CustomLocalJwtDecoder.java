package org.fleetassistant.backend.utils.config.security;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.fleetassistant.backend.jwt.service.JwtService;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class CustomLocalJwtDecoder implements JwtDecoder {
    private final JwtService jwtService;

    @Override
    public Jwt decode(String token) throws JwtException {
        Claims claims = jwtService.extractAllClaims(token);
        return new Jwt(
                token,
                claims.getIssuedAt().toInstant(),
                claims.getExpiration().toInstant(),
                jwtService.extractAllHeaders(token),
                claims);
    }
}
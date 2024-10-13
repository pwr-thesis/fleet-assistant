package org.fleetassistant.backend.jwt;

import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CustomJwtDecoder implements JwtDecoder {
    private final JwtDecoder oauthTokenDecoder;
    private final JwtDecoder jwtAccessTokenDecoder;

    @Override
    public Jwt decode(String token) throws JwtException {
        try {
            return oauthTokenDecoder.decode(token);
        } catch (Exception e) {
            return jwtAccessTokenDecoder.decode(token);
        }
    }
}
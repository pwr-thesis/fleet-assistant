package org.fleetassistant.backend.utils.config.security.decoders;

import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CustomJwtDecoder implements JwtDecoder {
    private final JwtDecoder oauthTokenDecoder;
    private final CustomLocalJwtDecoder customLocalJwtDecoder;

    @Override
    public Jwt decode(String token) throws JwtException {
        try {
            return oauthTokenDecoder.decode(token);
        } catch (Exception e) {
            return customLocalJwtDecoder.decode(token);
        }
    }
}
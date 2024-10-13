package org.fleetassistant.backend.jwt;

import lombok.Data;

@Data
public class TokenDTO {
    private Long userId;
    private String accessToken;
    private String refreshToken;
}
package org.fleetassistant.backend.jwt.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TokenDTO {
    private Long userId;
    private String accessToken;
    private String refreshToken;
}
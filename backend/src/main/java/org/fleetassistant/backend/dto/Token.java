package org.fleetassistant.backend.dto;

import lombok.Builder;

@Builder
public record Token(
        Long userId,
        String accessToken,
        String refreshToken) {
}
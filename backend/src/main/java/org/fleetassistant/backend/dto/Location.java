package org.fleetassistant.backend.dto;

import lombok.Builder;

@Builder
public record Location(Long id,
                       Double longitude,
                       Double latitude) {
}
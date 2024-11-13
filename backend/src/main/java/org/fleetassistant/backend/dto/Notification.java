package org.fleetassistant.backend.dto;

import lombok.Builder;

@Builder
public record Notification(String message, String email) {
}

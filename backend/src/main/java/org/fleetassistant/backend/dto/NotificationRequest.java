package org.fleetassistant.backend.dto;

import lombok.Builder;

@Builder
public record NotificationRequest(String message, String email) {
}

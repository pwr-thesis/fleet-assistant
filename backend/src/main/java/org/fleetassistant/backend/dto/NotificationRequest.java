package org.fleetassistant.backend.dto;

import lombok.Builder;

@Builder
public record NotificationRequest(String title, String message, String email) {
}

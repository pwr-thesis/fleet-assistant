package org.fleetassistant.backend.dto;

import lombok.Builder;

import java.time.LocalDate;

@Builder
public record Notification(String title, String message, LocalDate createdOn) {
}

package org.fleetassistant.backend.dto;

public record DriverSearchRequest(
        String name,
        String surname,
        String email) {
}

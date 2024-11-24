package org.fleetassistant.backend.dto;

public record VehicleSearchRequest(
        String name,
        String countryCode,
        Long driverId,
        Boolean isDriverAssigned) {
}

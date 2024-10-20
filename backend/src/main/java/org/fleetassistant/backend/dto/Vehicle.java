package org.fleetassistant.backend.dto;

public record Vehicle(
        Long id,
        String vin,
        String plateNumber,
        String countryCode) {
}
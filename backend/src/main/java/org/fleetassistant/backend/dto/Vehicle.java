package org.fleetassistant.backend.dto;

import lombok.Builder;

import java.time.LocalDate;

@Builder
public record Vehicle(
        Long id,
        String name,
        String vin,
        String plateNumber,
        String countryCode,
        LocalDate insuranceDate,
        LocalDate lastInspectionDate,
        LocalDate nextInspectionDate,
        LocalDate productionDate) {
}
package org.fleetassistant.backend.dto;

import jakarta.validation.constraints.*;
import lombok.Builder;

import java.time.LocalDate;
import java.util.List;

@Builder
public record Vehicle(
        Long id,
        @NotBlank(message = "Name is required")
        @Size(min = 3, max = 255, message = "Name must be between 3 and 255 characters")
        String name,
        @NotBlank(message = "VIN is required")
        @Size(min = 17, max = 17, message = "VIN must be exactly 17 characters")
        String vin,
        @NotBlank(message = "Plate number is required")
        @Size(min = 1, max = 15, message = "Plate number must be between 1 and 15 characters")
        String plateNumber,
        @NotBlank(message = "Country code is required")
        @Size(min = 1, max = 3, message = "Country code must be between 1 and 3 characters")
        String countryCode,
        @NotNull(message = "Insurance date is required")
        @Future
        LocalDate insuranceDate,
        @NotNull(message = "Last inspection date is required")
        @Past
        LocalDate lastInspectionDate,
        LocalDate nextInspectionDate,
        @NotNull(message = "Production date is required")
        LocalDate productionDate,
        List<Location> locations,
        Driver driver) {
}
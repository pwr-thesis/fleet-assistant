package org.fleetassistant.backend.dto;


import lombok.Builder;
import org.fleetassistant.backend.auth.credentials.model.Role;

import java.time.LocalDate;

@Builder
public record Driver(Long id,
                     String name,
                     String surname,
                     Role role,
                     String email,
                     String isEnabled,
                     String drivingLicenseNumber,
                     String driverLicenseCountryCode,
                     LocalDate birthDate) {
}
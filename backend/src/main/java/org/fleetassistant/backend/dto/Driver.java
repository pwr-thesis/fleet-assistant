package org.fleetassistant.backend.dto;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import org.fleetassistant.backend.auth.credentials.model.Role;

import java.time.LocalDate;

@Builder
public record Driver(Long id,
                     @NotBlank(message = "Name is required")
                     @Size(min = 3, max = 50, message = "Name must be between 3 and 50 characters")
                     String name,
                     @NotBlank(message = "Surname is required")
                     @Size(min = 3, max = 50, message = "Surname must be between 3 and 50 characters")
                     String surname,
                     Role role,
                     @NotBlank(message = "Email is required")
                     @Email(message = "Invalid email format")
                     @Size(max = 50, message = "Email cannot exceed 50 characters")
                     String email,
                     Boolean isEnabled,
                     @NotBlank(message = "Driving license number is required")
                     @Size(min = 2, max = 20, message = "Driving license number must be between 2 and 20 characters")
                     String drivingLicenseNumber,

                     @NotBlank(message = "Driver license country code is required")
                     @Size(min = 1, max = 3, message = "Country code must be between 1 and 3 characters")
                     String driverLicenseCountryCode,
                     @NotNull(message = "Date of birth is required")
                     LocalDate birthDate) {
}
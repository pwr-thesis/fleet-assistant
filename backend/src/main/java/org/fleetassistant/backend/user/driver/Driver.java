package org.fleetassistant.backend.user.driver;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.fleetassistant.backend.user.FAUser;
import org.fleetassistant.backend.user.manager.Manager;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Driver extends FAUser {
    @Column(nullable = false, length = 20)
    private String drivingLicenseNumber;
    @Column(nullable = false, length = 3)
    private String drivingLicenseCountryCode;
    @Column(nullable = false)
    private LocalDate birthDate;
    @CreatedDate
    private LocalDate createdOn;
    @ManyToOne
    private Manager manager;
}
package org.fleetassistant.backend.user.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Driver extends User {
    @Column(nullable = false, length = 20)
    private String drivingLicenseNumber;
    @Column(nullable = false, length = 3)
    private String drivingLicenseCountryCode;
    @Column(nullable = false)
    private LocalDate birthDate;
    @CreatedDate
    private LocalDate createdOn;
    @ManyToOne
    @JoinColumn(name = "manager_id")
    private Manager manager;
}
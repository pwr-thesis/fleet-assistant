package org.fleetassistant.backend.user.model;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.fleetassistant.backend.vehicle.model.Vehicle;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Manager extends User {
    @Builder.Default
    private LocalDate createdOn = LocalDate.now();
    @OneToMany(mappedBy = "manager")
    private List<Driver> assignedDrivers;
    @OneToMany(mappedBy = "manager")
    private List<Vehicle> assignedVehicles;
}
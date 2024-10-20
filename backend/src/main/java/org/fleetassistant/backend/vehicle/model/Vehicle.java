package org.fleetassistant.backend.vehicle.model;

import jakarta.persistence.*;
import lombok.*;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.fleetassistant.backend.user.model.Driver;
import org.fleetassistant.backend.user.model.Manager;

import java.time.LocalDate;


@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Column(nullable = false, length = 50)
    private String vin;
    @Column(length = 15)
    private String plateNumber;
    @Column(length = 3)
    private String countryCode;
    private LocalDate insuranceDate;
    private LocalDate lastInspectionDate;
    private LocalDate nextInspectionDate;
    private LocalDate productionDate;
    @OneToOne
    private Driver driver;
    @ManyToOne
    @JoinColumn(name = "manager_id")
    private Manager manager;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Vehicle vehicle = (Vehicle) o;
        return new EqualsBuilder().append(id, vehicle.id)
                                  .append(vin, vehicle.vin)
                                  .append(plateNumber, vehicle.plateNumber)
                                  .append(countryCode, vehicle.countryCode)
                                  .isEquals();
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder(17, 37).append(id).append(vin).append(plateNumber).append(countryCode).toHashCode();
    }
}
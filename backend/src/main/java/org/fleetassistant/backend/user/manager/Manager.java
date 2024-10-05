package org.fleetassistant.backend.user.manager;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.fleetassistant.backend.user.FAUser;
import org.fleetassistant.backend.user.driver.Driver;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Manager extends FAUser {
    @CreatedDate
    private LocalDate createdOn;
    @OneToMany(mappedBy = "manager")
    private List<Driver> assignedDrivers;
}
package org.fleetassistant.backend.user.repository;

import org.fleetassistant.backend.user.model.Driver;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DriverRepository extends JpaRepository<Driver, Long> {
    Optional<Driver> findById(Long id);
}
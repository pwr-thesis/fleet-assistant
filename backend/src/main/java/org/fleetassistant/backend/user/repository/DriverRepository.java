package org.fleetassistant.backend.user.repository;

import org.fleetassistant.backend.user.model.Driver;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DriverRepository extends JpaRepository<Driver, Long> {
    Optional<Driver> findById(Long id);

    Page<Driver> findAllByManagerId(Long managerId, Pageable pageable);

    List<Driver> findAllByManagerIdAndCredentialsIsEnabled(Long managerId, Pageable pageable, Boolean isEnabled);
}
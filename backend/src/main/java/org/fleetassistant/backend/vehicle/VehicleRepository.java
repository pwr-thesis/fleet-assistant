package org.fleetassistant.backend.vehicle;

import org.fleetassistant.backend.vehicle.model.Vehicle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    Page<Vehicle> findAllByManagerId(Long managerId, Pageable pageable);

    Page<Vehicle> findAllByDriverId(Long driverId, Pageable pageable);
}
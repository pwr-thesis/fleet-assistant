package org.fleetassistant.backend.vehicle;

import org.fleetassistant.backend.dto.Driver;
import org.fleetassistant.backend.vehicle.model.Vehicle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    @Query("""
        SELECT v
        FROM Vehicle v
        WHERE v.manager.id = :managerId
          AND (:name IS NULL OR v.name LIKE %:name%)
          AND (:countryCode IS NULL OR v.countryCode LIKE %:countryCode%)
          AND (:driverId IS NULL OR v.driver.id = :driverId)
          AND (:isDriverAssigned IS NULL OR
               (:isDriverAssigned = FALSE AND v.driver IS NULL))
    """)
    Page<Vehicle> findAllByManagerId(
            @Param("managerId") Long managerId,
            @Param("name") String name,
            @Param("countryCode") String countryCode,
            @Param("driverId") Long driverId,
            @Param("isDriverAssigned") Boolean isDriverAssigned,
            Pageable pageable
    );

    @Query("""
        SELECT v
        FROM Vehicle v
        WHERE v.driver.id = :driverId
          AND (:name IS NULL OR v.name LIKE %:name%)
          AND (:countryCode IS NULL OR v.countryCode LIKE %:countryCode%)
    """)
    Page<Vehicle> findAllByDriverId(
            @Param("driverId") Long driverId,
            @Param("name") String name,
            @Param("countryCode") String countryCode,
            Pageable pageable);
}
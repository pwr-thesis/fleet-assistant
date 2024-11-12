package org.fleetassistant.backend.location;

import org.fleetassistant.backend.location.model.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
    Location findFirstByVehicle_IdOrderByIdDesc(Long vehicleId);
    void deleteAllByVehicle_Id(Long vehicleId);
}
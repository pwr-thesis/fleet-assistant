package org.fleetassistant.backend.location;

import org.fleetassistant.backend.location.model.Location;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
    Page<Location> findAllByVehicle_Id(Long vehicleId, Pageable pageable);
    void deleteAllByVehicle_Id(Long vehicleId  );
}
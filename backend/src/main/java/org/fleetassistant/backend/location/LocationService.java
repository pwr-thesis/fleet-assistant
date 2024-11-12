package org.fleetassistant.backend.location;

import lombok.RequiredArgsConstructor;
import org.fleetassistant.backend.location.model.Location;
import org.fleetassistant.backend.utils.EntityToDtoMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LocationService {
    private final LocationRepository locationRepository;
    private final EntityToDtoMapper entityToDtoMapper;

    public org.fleetassistant.backend.dto.Location create(Location location) {
        return entityToDtoMapper.locationToLocationDto(locationRepository.save(location));
    }

    public org.fleetassistant.backend.dto.Location readLastLocation(Long vehicleId) {
        return entityToDtoMapper.locationToLocationDto(locationRepository.findFirstByVehicle_IdOrderByIdDesc(vehicleId));
    }

    public void deleteAllByVehicleId(Long vehicleId) {
        locationRepository.deleteAllByVehicle_Id(vehicleId);
    }
}
package org.fleetassistant.backend.location;

import lombok.RequiredArgsConstructor;
import org.fleetassistant.backend.location.model.Location;
import org.fleetassistant.backend.utils.EntityToDtoMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LocationService {
    private final LocationRepository locationRepository;
    private final EntityToDtoMapper entityToDtoMapper;

    public org.fleetassistant.backend.dto.Location create(Location location) {
        return entityToDtoMapper.locationToLocationDto(locationRepository.save(location));
    }

    public Page<org.fleetassistant.backend.dto.Location> readAllByVehicleId(Long vehicleId, Pageable pageable) {
        return locationRepository.findAllByVehicle_Id(vehicleId, pageable).map(entityToDtoMapper::locationToLocationDto);
    }

    public void deleteAllByVehicleId(Long vehicleId) {
        locationRepository.deleteAllByVehicle_Id(vehicleId);
    }
}
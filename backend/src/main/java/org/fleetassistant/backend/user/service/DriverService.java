package org.fleetassistant.backend.user.service;

import lombok.RequiredArgsConstructor;
import org.fleetassistant.backend.exceptionhandler.rest.NoSuchObjectException;
import org.fleetassistant.backend.user.model.Driver;
import org.fleetassistant.backend.user.repository.DriverRepository;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DriverService {
    private final DriverRepository driverRepository;

    public Driver getDriverById(Long id) {
        return driverRepository.findById(id).orElseThrow(() -> new NoSuchObjectException("Driver with id " + id + " not found"));
    }
}

package org.fleetassistant.backend.user.controller;

import lombok.RequiredArgsConstructor;
import org.fleetassistant.backend.auth.credentials.CredentialsService;
import org.fleetassistant.backend.auth.credentials.model.Credentials;
import org.fleetassistant.backend.dto.Driver;
import org.fleetassistant.backend.user.service.DriverService;
import org.fleetassistant.backend.user.service.UserService;
import org.fleetassistant.backend.utils.EntityToDtoMapper;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;


@RestController
@RequestMapping("api/v1/driver")
@RequiredArgsConstructor
public class DriverController {
    private final DriverService driverService;
    private final EntityToDtoMapper entityToDtoMapper;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<String> createDriver(@RequestBody Driver driverDto) {
        return ResponseEntity.ok(driverService.create(driverDto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Driver> getDriverById(@PathVariable Long id) {
        Long loggedUserId = getLoggedUserId();
        var vehicle = driverService.getDriverById(id);
        if (!Objects.equals(vehicle.getManager().getId(), loggedUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(entityToDtoMapper.driverToDriverDto(driverService.getDriverById(id)));
    }

    @GetMapping
    public ResponseEntity<?> getDrivers(@PageableDefault Pageable pageable, @RequestParam(defaultValue = "false") Boolean registered) {
        Long id = getLoggedUserId();
        if (registered == null || !registered) {
            return ResponseEntity.ok(driverService.getDrivers(id, pageable));
        }
        return ResponseEntity.ok(driverService.getRegisteredDrivers(id, pageable));
    }

    private Long getLoggedUserId() {
        Credentials credentials = CredentialsService.getCredentials();
        return userService.getUserIdByEmail(credentials.getEmail());
    }
}
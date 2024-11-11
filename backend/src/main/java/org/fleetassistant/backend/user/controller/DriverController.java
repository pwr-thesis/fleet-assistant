package org.fleetassistant.backend.user.controller;

import lombok.RequiredArgsConstructor;
import org.fleetassistant.backend.dto.Driver;
import org.fleetassistant.backend.user.service.DriverService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("api/v1/driver")
@RequiredArgsConstructor
public class DriverController {
    private final DriverService driverService;

    @PostMapping
    public ResponseEntity<String> createDriver(@RequestBody Driver driverDto) {
        return ResponseEntity.ok(driverService.create(driverDto));
    }
}
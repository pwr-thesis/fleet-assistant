package org.fleetassistant.backend.vehicle.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.fleetassistant.backend.dto.Vehicle;
import org.fleetassistant.backend.vehicle.VehicleService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/vehicle")
@RequiredArgsConstructor
public class VehicleController {
    private final VehicleService carService;

    @PostMapping
    public ResponseEntity<Vehicle> create(@RequestBody @Valid Vehicle vehicle) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(carService.create(vehicle));
    }

    @GetMapping
    public ResponseEntity<Page<Vehicle>> readAll(Pageable pageable) {
        return ResponseEntity.ok(carService.readAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vehicle> readById(@PathVariable Long id) {
        return ResponseEntity.ok(carService.readById(id));
    }
}
package org.fleetassistant.backend.vehicle.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.fleetassistant.backend.dto.Location;
import org.fleetassistant.backend.dto.Vehicle;
import org.fleetassistant.backend.location.LocationService;
import org.fleetassistant.backend.vehicle.VehicleService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.time.Duration;

@RestController
@RequestMapping("/api/v1/vehicle")
@RequiredArgsConstructor
public class VehicleController {
    private final VehicleService vehicleService;
    private final LocationService locationService;
    @PostMapping
    public ResponseEntity<Vehicle> create(@RequestBody @Valid Vehicle vehicle) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(vehicleService.create(vehicle));
    }

    @GetMapping
    public ResponseEntity<Page<Vehicle>> readAll(Pageable pageable) {
        return ResponseEntity.ok(vehicleService.readAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vehicle> readById(@PathVariable Long id) {
        return ResponseEntity.ok(vehicleService.readById(id));
    }

    @PostMapping("/{id}/location")
    public ResponseEntity<Location> updateLocation(@RequestBody @Valid Location locationDTO,
                                                      @PathVariable Long id) {
        return ResponseEntity.ok(vehicleService.updateLocation(locationDTO, id));
    }
    @DeleteMapping("/{id}/location")
    public ResponseEntity<Void> deleteLocations(@PathVariable Long id) {
        vehicleService.deleteLocations(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping(path = "/{id}/location-stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ServerSentEvent<Page<Location>>> locationStream(@PathVariable Long id,
                                                                @PageableDefault Pageable pageable) {
        Page<Location> initialPage = locationService.readAllByVehicleId(id, pageable);

        Flux<ServerSentEvent<Page<Location>>> initialData = Flux.just(ServerSentEvent.<Page<Location>>builder()
                .data(initialPage)
                .build());
        Flux<ServerSentEvent<Page<Location>>> periodicUpdates = Flux.interval(Duration.ofSeconds(5))
                .flatMap(sequence -> {
                    Page<Location> updatedPage =
                            locationService.readAllByVehicleId(id, pageable);
                    return Flux.just(ServerSentEvent.<Page<Location>>builder()
                            .id(String.valueOf(sequence))
                            .data(updatedPage)
                            .build());
                });

        return Flux.concat(initialData, periodicUpdates);
    }
}
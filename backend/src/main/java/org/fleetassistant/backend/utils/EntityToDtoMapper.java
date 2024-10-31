package org.fleetassistant.backend.utils;

import org.fleetassistant.backend.auth.credentials.model.Credentials;
import org.fleetassistant.backend.location.model.Location;
import org.fleetassistant.backend.user.model.User;
import org.fleetassistant.backend.vehicle.model.Vehicle;
import org.mapstruct.Mapper;


@Mapper(componentModel = "spring")
public interface EntityToDtoMapper {
    Vehicle vehicleDtoToVehicle(org.fleetassistant.backend.dto.Vehicle vehicleDto);

    org.fleetassistant.backend.dto.Vehicle vehicleToVehicleDto(Vehicle vehicle);

    Location locationDtoToLocation(org.fleetassistant.backend.dto.Location location);
    org.fleetassistant.backend.dto.Location locationToLocationDto(Location location);
    default org.fleetassistant.backend.dto.User userToUserDto(User user) {
        Credentials credentials = user.getCredentials();
        return org.fleetassistant.backend.dto.User.builder()
                .name(user.getName())
                .surname(user.getSurname())
                .role(credentials.getRole())
                .email(credentials.getEmail())
                .build();
    }
}
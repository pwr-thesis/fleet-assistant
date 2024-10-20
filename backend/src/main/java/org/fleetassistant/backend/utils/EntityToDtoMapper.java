package org.fleetassistant.backend.utils;

import org.fleetassistant.backend.auth.credentials.model.Credentials;
import org.fleetassistant.backend.user.model.User;
import org.mapstruct.Mapper;


@Mapper(componentModel = "spring")
public interface EntityToDtoMapper {
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
package org.fleetassistant.backend.dto;


import lombok.Builder;
import org.fleetassistant.backend.auth.credentials.model.Role;

@Builder
public record User(Long id, String name, String surname, Role role, String email) {
}
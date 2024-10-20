package org.fleetassistant.backend.dto;


import lombok.Builder;
import lombok.Data;
import org.fleetassistant.backend.auth.credentials.model.Role;

@Builder
@Data
public class UserDTO {
    private String name;
    private String surname;
    private Role role;
    private String email;
}

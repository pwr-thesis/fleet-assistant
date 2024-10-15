package org.fleetassistant.backend.auth.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.fleetassistant.backend.jwt.model.TokenDTO;
import org.fleetassistant.backend.user.dto.UserDTO;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponse {
    private UserDTO user;
    private TokenDTO token;
}
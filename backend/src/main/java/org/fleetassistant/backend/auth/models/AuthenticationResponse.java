package org.fleetassistant.backend.auth.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.fleetassistant.backend.dto.User;
import org.fleetassistant.backend.dto.Token;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponse {
    private User user;
    private Token token;
}
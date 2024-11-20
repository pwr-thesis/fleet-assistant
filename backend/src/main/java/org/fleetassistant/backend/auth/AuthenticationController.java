package org.fleetassistant.backend.auth;

import lombok.RequiredArgsConstructor;
import org.fleetassistant.backend.auth.credentials.CredentialsService;
import org.fleetassistant.backend.auth.models.AuthenticationRequest;
import org.fleetassistant.backend.auth.models.AuthenticationResponse;
import org.fleetassistant.backend.auth.models.RegisterRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/auth/")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService authenticationService;
    private final CredentialsService credentialsService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authenticationService.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }

    @PostMapping("/activation")
    public ResponseEntity<Void> activateAccount(@RequestParam String token) {
        credentialsService.activateAccount(token);
        return ResponseEntity.noContent().build();
    }
}
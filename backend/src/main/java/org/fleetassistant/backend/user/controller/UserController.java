package org.fleetassistant.backend.user.controller;

import lombok.RequiredArgsConstructor;
import org.fleetassistant.backend.auth.credentials.CredentialsService;
import org.fleetassistant.backend.auth.credentials.model.Credentials;
import org.fleetassistant.backend.dto.User;
import org.fleetassistant.backend.user.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("api/v1/user/")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/data")
    public ResponseEntity<User> getData() {
        Credentials credentials = CredentialsService.getCredentials();
        return ResponseEntity.ok(userService.getUserByEmail(credentials.getEmail()));
    }
}
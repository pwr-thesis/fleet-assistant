package org.fleetassistant.backend.user.controller;

import lombok.RequiredArgsConstructor;
import org.fleetassistant.backend.auth.credentials.model.Credentials;
import org.fleetassistant.backend.dto.UserDTO;
import org.fleetassistant.backend.user.model.User;
import org.fleetassistant.backend.user.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("api/v1/user/")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/data")
    public ResponseEntity<UserDTO> getData() {
        SecurityContext securityContextHolder = SecurityContextHolder.getContext();
        Credentials credentials = (Credentials) securityContextHolder.getAuthentication().getPrincipal();
        User user = userService.getUserByEmail(credentials.getEmail());
        return ResponseEntity.ok(UserDTO.builder().
                name(user.getName()).
                surname(user.getSurname()).
                role(credentials.getRole()).
                email(credentials.getEmail())
                .build());
    }
}
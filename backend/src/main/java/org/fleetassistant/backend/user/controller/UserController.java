package org.fleetassistant.backend.user.controller;

import lombok.RequiredArgsConstructor;
import org.fleetassistant.backend.auth.credentials.model.Credentials;
import org.fleetassistant.backend.dto.User;
import org.fleetassistant.backend.user.service.UserService;
import org.fleetassistant.backend.utils.EntityToDtoMapper;
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
    public ResponseEntity<User> getData() {
        SecurityContext securityContextHolder = SecurityContextHolder.getContext();
        Credentials credentials = (Credentials) securityContextHolder.getAuthentication().getPrincipal();
        return ResponseEntity.ok(userService.getUserByEmail(credentials.getEmail()));
    }
}
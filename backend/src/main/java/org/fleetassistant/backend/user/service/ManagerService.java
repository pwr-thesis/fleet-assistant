package org.fleetassistant.backend.user.service;

import lombok.RequiredArgsConstructor;
import org.fleetassistant.backend.auth.models.RegisterRequest;
import org.fleetassistant.backend.exceptionhandler.rest.NoSuchObjectException;
import org.fleetassistant.backend.user.model.Manager;
import org.fleetassistant.backend.user.repository.ManagerRepository;
import org.fleetassistant.backend.user.repository.UserRepository;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ManagerService {
    private final UserRepository userRepository;
    private final ManagerRepository managerRepository;

    public Manager createManager(Jwt jwt) {
        Manager manager = Manager.builder()
                .name(jwt.getClaim("given_name"))
                .surname(jwt.getClaim("family_name"))
                .build();
        return userRepository.save(manager);
    }

    public Manager createManager(RegisterRequest request) {
        Manager manager = Manager.builder()
                .name(request.getName())
                .surname(request.getSurname())
                .phone(request.getNumber())
                .build();
        return userRepository.save(manager);
    }

    public Manager getManagerByEmail(String email) {
        return managerRepository.findByCredentials_Email(email).orElseThrow(() -> new NoSuchObjectException("Manager with email: " + email + " not found"));
    }
}
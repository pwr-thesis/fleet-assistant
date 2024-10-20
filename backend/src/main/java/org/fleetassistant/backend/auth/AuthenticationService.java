package org.fleetassistant.backend.auth;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.fleetassistant.backend.auth.credentials.CredentialsService;
import org.fleetassistant.backend.auth.credentials.model.Credentials;
import org.fleetassistant.backend.auth.credentials.model.Role;
import org.fleetassistant.backend.auth.models.AuthenticationRequest;
import org.fleetassistant.backend.auth.models.AuthenticationResponse;
import org.fleetassistant.backend.auth.models.RegisterRequest;
import org.fleetassistant.backend.exceptionhandler.rest.ObjectAlreadyExistsException;
import org.fleetassistant.backend.jwt.service.JwtService;
import org.fleetassistant.backend.jwt.service.TokenGenerator;
import org.fleetassistant.backend.dto.UserDTO;
import org.fleetassistant.backend.user.model.Manager;
import org.fleetassistant.backend.user.model.User;
import org.fleetassistant.backend.user.service.ManagerService;
import org.fleetassistant.backend.user.service.UserService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import static org.fleetassistant.backend.utils.Constants.ALREADY_REGISTERED;
import static org.fleetassistant.backend.utils.Constants.USER_DOESNT_EXIST;


@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationService {
    private final CredentialsService credentialsService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final TokenGenerator tokenGenerator;
    private final JwtService jwtService;
    private final ManagerService managerService;
    private final UserService userService;

    @Transactional
    public AuthenticationResponse register(RegisterRequest request) {
        if (credentialsService.ifCredentialsExist(request.getEmail())) {
            throw new ObjectAlreadyExistsException(ALREADY_REGISTERED);
        }
        Credentials credentials = credentialsService.create(request.getEmail(),
                passwordEncoder.encode(request.getPassword()), Role.MANAGER);
        Manager manager = managerService.createManager(request);
        manager.setCredentials(credentials);
        return AuthenticationResponse.builder()
                .token(tokenGenerator.createToken(credentials))
                .user(
                        UserDTO.builder().
                                name(manager.getName()).
                                surname(manager.getSurname()).
                                role(credentials.getRole()).
                                email(credentials.getEmail())
                                .build())
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(),
                request.getPassword()));
        Credentials credentials = credentialsService.loadUserByUsername(request.getEmail());
        if (credentials == null) {
            throw new UsernameNotFoundException(USER_DOESNT_EXIST);
        }
        User user = userService.getUserByEmail(request.getEmail());
        return AuthenticationResponse.builder()
                .token(tokenGenerator.createToken(credentials))
                .user(
                        UserDTO.builder().
                                name(user.getName()).
                                surname(user.getSurname()).
                                role(credentials.getRole()).
                                email(credentials.getEmail())
                                .build())
                .build();
    }

    public String refreshToken(String jwt) {
        String email = jwtService.extractUsername(jwt);
        Credentials credentials = credentialsService.loadUserByUsername(email);
        return tokenGenerator.createAccessToken(credentials);
    }
}
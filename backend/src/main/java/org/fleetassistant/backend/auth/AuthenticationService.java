package org.fleetassistant.backend.auth;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.fleetassistant.backend.auth.credentials.CredentialsService;
import org.fleetassistant.backend.auth.credentials.model.Credentials;
import org.fleetassistant.backend.auth.credentials.model.Role;
import org.fleetassistant.backend.auth.models.AuthenticationRequest;
import org.fleetassistant.backend.auth.models.RegisterRequest;
import org.fleetassistant.backend.exceptionhandler.rest.EmailNotFoundException;
import org.fleetassistant.backend.exceptionhandler.rest.InvalidTokenException;
import org.fleetassistant.backend.exceptionhandler.rest.ObjectAlreadyExistsException;
import org.fleetassistant.backend.jwt.TokenDTO;
import org.fleetassistant.backend.jwt.service.JwtService;
import org.fleetassistant.backend.jwt.service.TokenGenerator;
import org.fleetassistant.backend.user.service.ManagerService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import static org.fleetassistant.backend.utils.Constants.*;


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

    @Transactional
    public TokenDTO register(RegisterRequest request) {
        if (credentialsService.ifCredentialsExist(request.getEmail())) {
            throw new ObjectAlreadyExistsException(ALREADY_REGISTERED);
        }
        Credentials credentials = credentialsService.create(request.getEmail(),
                passwordEncoder.encode(request.getPassword()), Role.MANAGER);
        managerService.createManager(request);
        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                new UsernamePasswordAuthenticationToken(credentials,
                        request.getPassword());
        return tokenGenerator.createToken(usernamePasswordAuthenticationToken);

    }

    public TokenDTO authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(),
                request.getPassword()));
        Credentials credentials = credentialsService.loadUserByUsername(request.getEmail());

        if (credentials == null) {
            throw new UsernameNotFoundException(USER_DOESNT_EXIST);
        }
        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                new UsernamePasswordAuthenticationToken(credentials,
                        request.getPassword());


        return tokenGenerator.createToken(usernamePasswordAuthenticationToken);
    }

    public String refreshToken(String jwt) {
        String userEmail = jwtService.extractUsername(jwt);
        if (userEmail == null) {
            throw new EmailNotFoundException(MISSING_USER_EMAIL);
        }
        UserDetails userDetails = credentialsService.loadUserByUsername(userEmail);
        if (!jwtService.isTokenValid(jwt, userDetails)) {
            throw new InvalidTokenException(TOKEN_IS_INVALID);
        }
        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                new UsernamePasswordAuthenticationToken(userDetails,
                        userDetails.getAuthorities());
        return tokenGenerator.createAccessToken(usernamePasswordAuthenticationToken);
    }
}
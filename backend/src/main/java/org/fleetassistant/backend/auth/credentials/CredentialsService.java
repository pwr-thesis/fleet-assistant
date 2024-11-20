package org.fleetassistant.backend.auth.credentials;

import lombok.RequiredArgsConstructor;
import org.fleetassistant.backend.auth.credentials.model.Credentials;
import org.fleetassistant.backend.auth.credentials.model.Role;
import org.fleetassistant.backend.exceptionhandler.rest.AccountIsActiveException;
import org.fleetassistant.backend.exceptionhandler.rest.EmailNotFoundException;
import org.fleetassistant.backend.exceptionhandler.rest.InvalidTokenException;
import org.fleetassistant.backend.jwt.model.TokenType;
import org.fleetassistant.backend.jwt.service.JwtService;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CredentialsService implements UserDetailsService {
    private final CredentialsRepository credentialsRepository;
    private final JwtService jwtService;

    @Override
    public Credentials loadUserByUsername(String email) {
        return credentialsRepository.findByEmail(email).orElse(null);
    }

    public Credentials create(String email, Role role, boolean isEnabled) {
        Credentials newCredentials = createCredentials(email, role).build();
        newCredentials.setIsEnabled(isEnabled);
        return credentialsRepository.save(newCredentials);
    }


    public Credentials create(String email, String password, Role role) {
        Credentials newCredentials = createCredentials(email, role)
                .password(password)
                .build();
        return credentialsRepository.save(newCredentials);
    }

    public boolean ifCredentialsExist(String email) {
        return credentialsRepository.findByEmail(email).isPresent();
    }

    public static Credentials getCredentials() {
        SecurityContext securityContextHolder = SecurityContextHolder.getContext();
        Credentials credentials = (Credentials) securityContextHolder.getAuthentication().getPrincipal();
        return credentials;
    }

    @Transactional
    public void activateAccount(String token) {
        String email = jwtService.extractUsername(token);
        if (jwtService.extractType(token) != TokenType.EMAIL_VALIDATION || email.isEmpty()) {
            throw new InvalidTokenException("Invalid token");
        }
        Credentials credentials =
                credentialsRepository.findByEmail(email).orElseThrow(() -> new EmailNotFoundException("Email not found"));
        if (credentials.isEnabled()) throw new AccountIsActiveException("Account is already active");
        credentials.setIsEnabled(true);
    }

    private Credentials.CredentialsBuilder createCredentials(String email, Role role) {
        return Credentials.builder()
                .email(email)
                .role(role);

    }
}
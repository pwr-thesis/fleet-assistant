package org.fleetassistant.backend.auth.credentials;

import lombok.RequiredArgsConstructor;
import org.fleetassistant.backend.auth.credentials.model.Credentials;
import org.fleetassistant.backend.auth.credentials.model.Role;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CredentialsService implements UserDetailsService {
    private final CredentialsRepository credentialsRepository;

    @Override
    public Credentials loadUserByUsername(String email) {
        return credentialsRepository.findByEmail(email).orElse(null);
    }

    public Credentials create(String email, Role role) {
        Credentials newCredentials = createCredentials(email, role).build();
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

    private Credentials.CredentialsBuilder createCredentials(String email, Role role) {
        return Credentials.builder()
                .email(email)
                .role(role);

    }
}
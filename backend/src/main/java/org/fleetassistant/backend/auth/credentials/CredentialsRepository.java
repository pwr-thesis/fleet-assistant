package org.fleetassistant.backend.auth.credentials;

import org.fleetassistant.backend.auth.credentials.model.Credentials;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CredentialsRepository extends JpaRepository<Credentials, Long> {
    Optional<Credentials> findByEmail(String email);
}
package org.fleetassistant.backend.user.repository;

import org.fleetassistant.backend.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByCredentials_Email(String email);
}
package org.fleetassistant.backend.user.repository;

import org.fleetassistant.backend.user.model.Manager;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ManagerRepository extends JpaRepository<Manager, Long> {
    Optional<Manager> findByCredentials_Email(String email);
}
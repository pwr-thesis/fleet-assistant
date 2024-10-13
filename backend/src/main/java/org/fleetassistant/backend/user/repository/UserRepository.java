package org.fleetassistant.backend.user.repository;

import org.fleetassistant.backend.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
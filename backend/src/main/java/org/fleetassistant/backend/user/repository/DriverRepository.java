package org.fleetassistant.backend.user.repository;

import org.fleetassistant.backend.user.model.Driver;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DriverRepository extends JpaRepository<Driver, Long> {
    Optional<Driver> findById(Long id);

    @Query("""
        SELECT d
        FROM Driver d
        WHERE d.manager.id = :managerId
        AND (:name IS NULL OR d.name LIKE %:name%)
        AND (:surname IS NULL OR d.surname LIKE %:surname%)
        AND (:email IS NULL OR d.credentials.email LIKE %:email%)
    """)
    Page<Driver> findAllByManagerId(@Param("managerId") Long managerId,
                                    @Param("name") String name,
                                    @Param("surname") String surname,
                                    @Param("email") String email,
                                    Pageable pageable);

    List<Driver> findAllByManagerIdAndCredentialsIsEnabled(Long managerId, Boolean isEnabled);
}
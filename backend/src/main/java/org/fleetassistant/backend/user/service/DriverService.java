package org.fleetassistant.backend.user.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.fleetassistant.backend.auth.credentials.CredentialsService;
import org.fleetassistant.backend.auth.credentials.model.Credentials;
import org.fleetassistant.backend.auth.credentials.model.Role;
import org.fleetassistant.backend.dto.NotificationRequest;
import org.fleetassistant.backend.dto.DriverSearchRequest;
import org.fleetassistant.backend.exceptionhandler.rest.NoSuchObjectException;
import org.fleetassistant.backend.jwt.service.TokenGenerator;
import org.fleetassistant.backend.notification.aws.SqsProducer;
import org.fleetassistant.backend.user.model.Driver;
import org.fleetassistant.backend.user.model.Manager;
import org.fleetassistant.backend.user.repository.DriverRepository;
import org.fleetassistant.backend.utils.EntityToDtoMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class DriverService {
    private final DriverRepository driverRepository;
    private final CredentialsService credentialsService;
    private final TokenGenerator tokenGenerator;
    private final ManagerService managerService;
    private final SqsProducer sqsProducer;
    @Value("${spring.verification.server}")
    private String verificationServer;
    private final EntityToDtoMapper entityToDtoMapper;


    public Driver getDriverById(Long id) {
        return driverRepository.findById(id).orElseThrow(() -> new NoSuchObjectException("Driver with id " + id + " not found"));
    }

    @Transactional
    public String create(org.fleetassistant.backend.dto.Driver driverDTO) {
        Credentials driverCredentials = credentialsService.create(driverDTO.email(), Role.DRIVER, false);
        Credentials credentials = CredentialsService.getCredentials();
        Manager manager = managerService.getManagerByEmail(credentials.getEmail());
        Driver driver = new Driver();
        driver.setName(driverDTO.name());
        driver.setSurname(driverDTO.surname());
        driver.setDrivingLicenseNumber(driverDTO.drivingLicenseNumber());
        driver.setDrivingLicenseCountryCode(driverDTO.driverLicenseCountryCode());
        driver.setBirthDate(driverDTO.birthDate());

        driver.setCredentials(driverCredentials);
        driver.setManager(manager);

        driverRepository.save(driver);
        String token = tokenGenerator.createValidationToken(driverCredentials);

        String verificationLink = verificationServer + "?token=" + token;
        String message = "Please click the link to verify your account: " + verificationLink;
        NotificationRequest notificationRequest = NotificationRequest.builder()
                .email(credentials.getEmail())
                .message(message)
                .build();
        sqsProducer.send(notificationRequest);

        return token;
    }

    public Page<org.fleetassistant.backend.dto.Driver> getDrivers(Long managerId, Pageable pageable, DriverSearchRequest driverSearchRequest) {
        return driverRepository.findAllByManagerId(managerId, driverSearchRequest.name(), driverSearchRequest.surname(), driverSearchRequest.email(), pageable).map(entityToDtoMapper::driverToDriverDto);
    }

    public List<org.fleetassistant.backend.dto.Driver> getRegisteredDrivers(Long id) {
        return driverRepository.findAllByManagerIdAndCredentialsIsEnabled(id, true).stream()
                .map(entityToDtoMapper::driverToDriverDto).collect(Collectors.toList());
    }
}

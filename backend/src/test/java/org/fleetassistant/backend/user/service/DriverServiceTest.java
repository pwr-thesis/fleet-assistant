package org.fleetassistant.backend.user.service;

import org.fleetassistant.backend.auth.credentials.CredentialsService;
import org.fleetassistant.backend.auth.credentials.model.Credentials;
import org.fleetassistant.backend.auth.credentials.model.Role;
import org.fleetassistant.backend.exceptionhandler.rest.NoSuchObjectException;
import org.fleetassistant.backend.jwt.service.TokenGenerator;
import org.fleetassistant.backend.notification.aws.SqsProducer;
import org.fleetassistant.backend.user.model.Manager;
import org.fleetassistant.backend.user.repository.DriverRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DriverServiceTest {

    @Mock
    private DriverRepository driverRepository;

    @Mock
    private CredentialsService credentialsService;

    @Mock
    private TokenGenerator tokenGenerator;

    @Mock
    private ManagerService managerService;
    @Mock
    private SqsProducer sqsProducer;

    @InjectMocks
    private DriverService driverService;

    private org.fleetassistant.backend.dto.Driver driverDTO;
    private Credentials credentials;
    private Manager manager;

    @BeforeEach
    void setUp() {
        driverDTO = org.fleetassistant.backend.dto.Driver.builder()
                .email("driver@driver.com")
                .name("John")
                .surname("Doe")
                .drivingLicenseNumber("123456")
                .driverLicenseCountryCode("US")
                .birthDate(LocalDate.of(1990, 1, 1))
                .build();

        credentials = Credentials.builder()
                .email("manager@example.com")
                .password("password123")
                .role(Role.MANAGER)
                .build();

        manager = new Manager();
        manager.setCredentials(credentials);

        SecurityContextHolder.setContext(new SecurityContext() {
            @Override
            public Authentication getAuthentication() {
                return new UsernamePasswordAuthenticationToken(credentials, null);
            }

            @Override
            public void setAuthentication(Authentication authentication) {
            }
        });


    }

    @Test
    void getDriverById_existingDriver_returnsDriver() {
        // Given
        org.fleetassistant.backend.user.model.Driver driver = new org.fleetassistant.backend.user.model.Driver();
        driver.setId(1L);
        driver.setName("John");
        when(driverRepository.findById(1L)).thenReturn(Optional.of(driver));

        // When
        org.fleetassistant.backend.user.model.Driver result = driverService.getDriverById(1L);

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("John", result.getName());
    }

    @Test
    void getDriverById_nonExistingDriver_throwsNoSuchObjectException() {
        // Given
        when(driverRepository.findById(anyLong())).thenReturn(Optional.empty());

        // When / Then
        NoSuchObjectException exception = assertThrows(NoSuchObjectException.class, () -> {
            driverService.getDriverById(1L);
        });
        assertEquals("Driver with id 1 not found", exception.getMessage());
    }

    @Test
    void create_validDriverDTO_createsAndSavesDriver() {
        // Given
        Credentials driverCredentials = Credentials.builder()
                .email(driverDTO.email())
                .role(Role.DRIVER)
                .isEnabled(false)
                .build();
        when(credentialsService.create(driverDTO.email(), Role.DRIVER, false)).thenReturn(driverCredentials);
        when(managerService.getManagerByEmail(credentials.getEmail())).thenReturn(manager);
        when(tokenGenerator.createValidationToken(driverCredentials)).thenReturn("validationToken");
        when(driverRepository.save(any(org.fleetassistant.backend.user.model.Driver.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        String token = driverService.create(driverDTO);

        // Then
        assertNotNull(token);
        assertEquals("validationToken", token);
        verify(driverRepository, times(1)).save(any(org.fleetassistant.backend.user.model.Driver.class));
    }

    @Test
    void create_validDriverDTO_generatesCorrectTokenAndSavesDriver() {
        // Given
        Credentials driverCredentials = Credentials.builder()
                .email(driverDTO.email())
                .role(Role.DRIVER)
                .isEnabled(false)
                .build();

        when(credentialsService.create(driverDTO.email(), Role.DRIVER, false)).thenReturn(driverCredentials);
        when(managerService.getManagerByEmail(credentials.getEmail())).thenReturn(manager);
        when(tokenGenerator.createValidationToken(driverCredentials)).thenReturn("validationToken");


        // When
        String token = driverService.create(driverDTO);

        // Then
        assertEquals("validationToken", token);
        verify(tokenGenerator).createValidationToken(driverCredentials);
    }
}

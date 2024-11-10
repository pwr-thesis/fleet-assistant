package org.fleetassistant.backend.vehicle;

import org.fleetassistant.backend.auth.credentials.model.Credentials;
import org.fleetassistant.backend.auth.credentials.model.Role;
import org.fleetassistant.backend.location.LocationService;
import org.fleetassistant.backend.location.model.Location;
import org.fleetassistant.backend.exceptionhandler.rest.NoSuchObjectException;
import org.fleetassistant.backend.exceptionhandler.rest.ObjectAlreadyExistsException;
import org.fleetassistant.backend.user.service.ManagerService;
import org.fleetassistant.backend.user.service.UserService;
import org.fleetassistant.backend.utils.EntityToDtoMapper;
import org.fleetassistant.backend.vehicle.model.Vehicle;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VehicleServiceTest {

    @Mock
    private VehicleRepository vehicleRepository;

    @Mock
    private EntityToDtoMapper entityToDtoMapper;
    @Mock
    private LocationService locationService;
    @Mock
    private UserService userService;
    @Mock
    private ManagerService managerService;

    @InjectMocks
    private VehicleService vehicleService;

    private Vehicle vehicle;
    private org.fleetassistant.backend.dto.Vehicle vehicleDto;
    private org.fleetassistant.backend.dto.Location locationDto;
    private Location location;

    @BeforeEach
    void setUp() {
        locationDto = org.fleetassistant.backend.dto.Location.builder()
                .id(1L)
                .latitude(1.1)
                .longitude(1.1)
                .build();
        location = Location.builder()
                .id(1L)
                .latitude(1.1)
                .longitude(1.1)
                .build();
        vehicle = Vehicle.builder()
                .id(1L)
                .vin("1FMYU021X7KB19729")
                .plateNumber("XYZ1234")
                .countryCode("US")
                .productionDate(LocalDate.of(2023, 5, 20))
                .lastInspectionDate(LocalDate.of(2023, 12, 10))
                .insuranceDate(LocalDate.of(2023, 12, 10))
                .locations(List.of(location))
                .build();

        vehicleDto = org.fleetassistant.backend.dto.Vehicle.builder()
                .id(1L)
                .vin("1FMYU021X7KB19729")
                .plateNumber("XYZ1234")
                .countryCode("US")
                .productionDate(LocalDate.of(2023, 5, 20))
                .lastInspectionDate(LocalDate.of(2023, 12, 10))
                .insuranceDate(LocalDate.of(2023, 12, 10))
                .build();

    }

    @Test
    void create_carDoesNotExist_shouldCreateCar() {
        when(entityToDtoMapper.vehicleDtoToVehicle(vehicleDto)).thenReturn(vehicle);
        when(vehicleRepository.exists(any())).thenReturn(false);
        when(vehicleRepository.save(any())).thenReturn(vehicle);
        when(entityToDtoMapper.vehicleToVehicleDto(vehicle)).thenReturn(vehicleDto);

        org.fleetassistant.backend.dto.Vehicle createdVehicleDto = vehicleService.create(vehicleDto);

        assertNotNull(createdVehicleDto);
        assertEquals(vehicleDto, createdVehicleDto);
        verify(vehicleRepository, times(1)).save(vehicle);
    }

    @Test
    void create_carExists_shouldThrowObjectAlreadyExistsException() {
        when(entityToDtoMapper.vehicleDtoToVehicle(vehicleDto)).thenReturn(vehicle);
        when(vehicleRepository.exists(any())).thenReturn(true);

        Exception exception = assertThrows(ObjectAlreadyExistsException.class, () -> vehicleService.create(vehicleDto));

        assertEquals(String.format(VehicleService.CAR_WITH_VIN_ALREADY_EXISTS, vehicle.getVin()), exception.getMessage());
        verify(vehicleRepository, never()).save(vehicle);
    }

    @Test
    void readAll_shouldReturnVehicles() {
        Pageable pageable = Pageable.ofSize(1);
        Page<Vehicle> vehiclePage = new PageImpl<>(List.of(vehicle));
        when(entityToDtoMapper.vehicleToVehicleDto(vehicle)).thenReturn(vehicleDto);
        when(vehicleRepository.findAllByManagerId(0L, pageable)).thenReturn(vehiclePage);

        Authentication authentication = Mockito.mock(Authentication.class);
        SecurityContext securityContext = Mockito.mock(SecurityContext.class);
        when(authentication.getPrincipal()).thenReturn(Credentials.builder().email("").role(Role.MANAGER).build());
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        Page<org.fleetassistant.backend.dto.Vehicle> result = vehicleService.readAll(pageable);

        assertNotNull(result);
        verify(vehicleRepository, times(1)).findAllByManagerId(any(),any());
    }

    @Test
    void readById_carExists_shouldReturnVehicle() {
        when(vehicleRepository.findById(anyLong())).thenReturn(Optional.of(vehicle));
        when(entityToDtoMapper.vehicleToVehicleDto(vehicle)).thenReturn(vehicleDto);

        org.fleetassistant.backend.dto.Vehicle result = vehicleService.readById(1L);

        assertNotNull(result);
        assertEquals(vehicleDto.vin(), result.vin());
        verify(vehicleRepository, times(1)).findById(1L);
    }

    @Test
    void readById_carDoesNotExist_shouldThrowNoSuchObjectException() {
        when(vehicleRepository.findById(anyLong())).thenReturn(Optional.empty());

        Exception exception = assertThrows(NoSuchObjectException.class, () -> vehicleService.readById(1L));

        assertEquals(String.format(VehicleService.VEHICLE_WITH_ID_NOT_FOUND, 1L), exception.getMessage());
    }

    @Test
    void isCarExists_shouldReturnTrueIfCarExists() {
        when(vehicleRepository.exists(any())).thenReturn(true);

        boolean exists = vehicleService.isVehicleExists(vehicle);

        assertTrue(exists);
    }

    @Test
    void isCarExists_shouldReturnFalseIfCarDoesNotExist() {
        when(vehicleRepository.exists(any())).thenReturn(false);

        boolean exists = vehicleService.isVehicleExists(vehicle);

        assertFalse(exists);
    }

    @Test
    void calculateNextInspectionDate_YoungerThanFourYears_ShouldReturnFourYearsFromProduction() {
        LocalDate productionDate = LocalDate.now().minusYears(3);
        LocalDate lastInspectionDate = LocalDate.of(2023, 12, 10);

        LocalDate result = vehicleService.calculateNextInspectionDate(productionDate, lastInspectionDate);

        assertEquals(productionDate.plusYears(4), result);
    }

    @Test
    void calculateNextInspectionDate_AgedBetweenFourAndTenYears_ShouldReturnTwoYearsFromLastInspection() {
        LocalDate productionDate = LocalDate.now().minusYears(5);
        LocalDate lastInspectionDate = LocalDate.of(2023, 12, 10);

        LocalDate result = VehicleService.calculateNextInspectionDate(productionDate, lastInspectionDate);

        assertEquals(lastInspectionDate.plusYears(2), result);
    }

    @Test
    void calculateNextInspectionDate_AgedBetweenFourAndTenYears_NoLastInspection_ShouldReturnTwoYearsFromProduction() {
        LocalDate productionDate = LocalDate.now().minusYears(6);

        LocalDate result = VehicleService.calculateNextInspectionDate(productionDate, null);

        assertEquals(productionDate.plusYears(2), result);
    }

    @Test
    void calculateNextInspectionDate_OlderThanTenYears_ShouldReturnOneYearFromLastInspection() {
        LocalDate productionDate = LocalDate.now().minusYears(11);
        LocalDate lastInspectionDate = LocalDate.of(2023, 12, 10);

        LocalDate result = VehicleService.calculateNextInspectionDate(productionDate, lastInspectionDate);

        assertEquals(lastInspectionDate.plusYears(1), result);
    }

    @Test
    void calculateNextInspectionDate_OlderThanTenYears_NoLastInspection_ShouldReturnFourYearsFromProduction() {
        LocalDate productionDate = LocalDate.now().minusYears(12);

        LocalDate result = VehicleService.calculateNextInspectionDate(productionDate, null);

        assertEquals(productionDate.plusYears(4), result);
    }

    @Test
    void calculateNextInspectionDate_NullProductionDate_ShouldReturnNull() {
        LocalDate result = VehicleService.calculateNextInspectionDate(null, LocalDate.of(2023, 12, 10));

        assertNull(result);
    }

    @Test
    void updateLocation_NoSuchObjectException() {
        when(vehicleRepository.findById(anyLong())).thenReturn(Optional.empty());

        Exception exception = assertThrows(NoSuchObjectException.class, () -> vehicleService.updateLocation(locationDto, 1L));

        assertEquals(String.format(VehicleService.VEHICLE_WITH_ID_NOT_FOUND, 1L), exception.getMessage());
    }

    @Test
    void updateLocation_success() {
        when(vehicleRepository.findById(anyLong())).thenReturn(Optional.of(vehicle));
        when(entityToDtoMapper.locationDtoToLocation(locationDto)).thenReturn(location);
        when(locationService.create(location)).thenReturn(locationDto);
        vehicleService.updateLocation(locationDto, 1L);
        assertNotNull(location.getVehicle());
    }

    @Test
    void deleteLocations_NoSuchObjectException() {
        when(vehicleRepository.findById(anyLong())).thenReturn(Optional.empty());

        Exception exception = assertThrows(NoSuchObjectException.class, () -> vehicleService.deleteLocations(1L));

        assertEquals(String.format(VehicleService.VEHICLE_WITH_ID_NOT_FOUND, 1L), exception.getMessage());
    }
    @Test
    void deleteLocations_success() {
        when(vehicleRepository.findById(anyLong())).thenReturn(Optional.of(vehicle));
        vehicleService.deleteLocations(1L);
        verify(locationService).deleteAllByVehicleId(1L);
    }
}

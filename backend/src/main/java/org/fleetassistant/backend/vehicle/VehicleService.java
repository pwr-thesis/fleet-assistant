package org.fleetassistant.backend.vehicle;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.fleetassistant.backend.auth.credentials.CredentialsService;
import org.fleetassistant.backend.auth.credentials.model.Credentials;
import org.fleetassistant.backend.auth.credentials.model.Role;
import org.fleetassistant.backend.exceptionhandler.rest.NoSuchObjectException;
import org.fleetassistant.backend.exceptionhandler.rest.ObjectAlreadyExistsException;
import org.fleetassistant.backend.location.LocationService;
import org.fleetassistant.backend.location.model.Location;
import org.fleetassistant.backend.user.model.Manager;
import org.fleetassistant.backend.user.service.DriverService;
import org.fleetassistant.backend.user.service.ManagerService;
import org.fleetassistant.backend.user.service.UserService;
import org.fleetassistant.backend.utils.EntityToDtoMapper;
import org.fleetassistant.backend.vehicle.model.Vehicle;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

import static org.springframework.data.domain.ExampleMatcher.GenericPropertyMatchers.exact;

@Service
@RequiredArgsConstructor
public class VehicleService {
    public static final String CAR_WITH_VIN_ALREADY_EXISTS = "Car with vin: %s already exists";
    public static final String VEHICLE_WITH_ID_NOT_FOUND = "Car with id: %d not found";
    private final VehicleRepository vehicleRepository;
    private final EntityToDtoMapper entityToDtoMapper;
    private final LocationService locationService;
    private final UserService userService;
    private final ManagerService managerService;
    private final DriverService driverService;

    @Transactional
    public org.fleetassistant.backend.dto.Vehicle create(org.fleetassistant.backend.dto.Vehicle vehicleDTO) {
        Vehicle vehicle = entityToDtoMapper.vehicleDtoToVehicle(vehicleDTO);
        if (isVehicleExists(vehicle))
            throw new ObjectAlreadyExistsException(String.format(CAR_WITH_VIN_ALREADY_EXISTS, vehicle.getVin()));

        Credentials credentials = CredentialsService.getCredentials();
        Manager manager = managerService.getManagerByEmail(credentials.getEmail());
        vehicle.setManager(manager);
        
        if (vehicleDTO.driver() != null) {
            var driver = driverService.getDriverById(vehicleDTO.driver().id());
            vehicle.setDriver(driver);
        }

        vehicle.setNextInspectionDate(calculateNextInspectionDate(vehicle.getProductionDate(), vehicle.getLastInspectionDate()));
        return entityToDtoMapper.vehicleToVehicleDto(vehicleRepository.save(vehicle));
    }

    public Page<org.fleetassistant.backend.dto.Vehicle> readAll(Pageable pageable) {
        Credentials credentials = CredentialsService.getCredentials();
        Long id = userService.getUserIdByEmail(credentials.getEmail());
        if (credentials.getRole().equals(Role.MANAGER)) {
            return vehicleRepository.findAllByManagerId(id, pageable).map(entityToDtoMapper::vehicleToVehicleDto);
        } else {
            return vehicleRepository.findAllByDriverId(id, pageable).map(entityToDtoMapper::vehicleToVehicleDto);
        }
    }


    public org.fleetassistant.backend.dto.Vehicle readById(Long id) {
        return entityToDtoMapper.vehicleToVehicleDto(readVehicleById(id));
    }

    public boolean isVehicleExists(Vehicle car) {
        ExampleMatcher matcher = ExampleMatcher.matching()
                .withIgnorePaths("id")
                .withIgnorePaths("driver")
                .withIgnorePaths("locations")
                .withMatcher("vin", exact())
                .withMatcher("plateNumber", exact())
                .withMatcher("countryCode", exact());
        return vehicleRepository.exists(Example.of(car, matcher));
    }

    public org.fleetassistant.backend.dto.Location updateLocation(org.fleetassistant.backend.dto.Location locationDTO, Long id) {
        Location location = entityToDtoMapper.locationDtoToLocation(locationDTO);
        Vehicle vehicle = readVehicleById(id);
        location.setVehicle(vehicle);
        return locationService.create(location);
    }

    @Transactional
    public void deleteLocations(Long id) {
        Vehicle vehicle = readVehicleById(id);
        locationService.deleteAllByVehicleId(vehicle.getId());
    }

    private Vehicle readVehicleById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new NoSuchObjectException(String.format(VEHICLE_WITH_ID_NOT_FOUND, id)));
    }
    public org.fleetassistant.backend.dto.Vehicle assignDriver(Long id, Long driverId) {
        Vehicle vehicle = readVehicleById(id);
        vehicle.setDriver(driverService.getDriverById(driverId));
        return entityToDtoMapper.vehicleToVehicleDto(vehicleRepository.save(vehicle));
    }

    static LocalDate calculateNextInspectionDate(LocalDate productionDate, LocalDate lastInspectionDate) {
        if (productionDate != null) {
            int age = LocalDate.now().getYear() - productionDate.getYear();
            if (age < 4) {
                return productionDate.plusYears(4);
            } else if (age < 10) {
                return lastInspectionDate != null ? lastInspectionDate.plusYears(2) : productionDate.plusYears(2);
            } else {
                return lastInspectionDate != null ? lastInspectionDate.plusYears(1) : productionDate.plusYears(4);
            }
        }
        return null;
    }
}
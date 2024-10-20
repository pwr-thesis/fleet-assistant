package org.fleetassistant.backend.vehicle;

import lombok.RequiredArgsConstructor;
import org.fleetassistant.backend.exceptionhandler.rest.NoSuchObjectException;
import org.fleetassistant.backend.exceptionhandler.rest.ObjectAlreadyExistsException;
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
    public static final String CAR_WITH_ID_NOT_FOUND = "Car with id: %d not found";
    private final VehicleRepository vehicleRepository;
    private final EntityToDtoMapper entityToDtoMapper;

    public org.fleetassistant.backend.dto.Vehicle create(org.fleetassistant.backend.dto.Vehicle carDTO) {
        Vehicle car = entityToDtoMapper.vehicleDtoToVehicle(carDTO);
        if (isCarExists(car))
            throw new ObjectAlreadyExistsException(String.format(CAR_WITH_VIN_ALREADY_EXISTS, car.getVin()));
        car.setNextInspectionDate(calculateNextInspectionDate(car.getProductionDate(), car.getLastInspectionDate()));
        return entityToDtoMapper.vehicleToVehicleDto(vehicleRepository.save(car));
    }

    public Page<org.fleetassistant.backend.dto.Vehicle> readAll(Pageable pageable) {
        return vehicleRepository.findAll(pageable).map(entityToDtoMapper::vehicleToVehicleDto);
    }

    public org.fleetassistant.backend.dto.Vehicle readById(Long id) {
        return entityToDtoMapper.vehicleToVehicleDto(readCarById(id));
    }

    public boolean isCarExists(Vehicle car) {
        ExampleMatcher matcher = ExampleMatcher.matching()
                .withIgnorePaths("id")
                .withIgnorePaths("driver")
                .withIgnorePaths("locations")
                .withMatcher("vin", exact())
                .withMatcher("plateNumber", exact())
                .withMatcher("countryCode", exact());
        return vehicleRepository.exists(Example.of(car, matcher));
    }

    private Vehicle readCarById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new NoSuchObjectException(String.format(CAR_WITH_ID_NOT_FOUND, id)));
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
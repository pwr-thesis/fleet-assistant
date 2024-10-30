package org.fleetassistant.backend.location;

import org.fleetassistant.backend.location.model.Location;
import org.fleetassistant.backend.utils.EntityToDtoMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LocationServiceTest {
    @Mock
    private LocationRepository locationRepository;

    @Mock
    private EntityToDtoMapper entityToDtoMapper;

    @InjectMocks
    private LocationService locationService;

    @Test
    void create_shouldSaveLocationAndReturnDto() {
        Location locationEntity = new Location();
        org.fleetassistant.backend.dto.Location locationDto = org.fleetassistant.backend.dto.Location.builder().build();

        when(locationRepository.save(locationEntity)).thenReturn(locationEntity);
        when(entityToDtoMapper.locationToLocationDto(locationEntity)).thenReturn(locationDto);

        org.fleetassistant.backend.dto.Location result = locationService.create(locationEntity);

        assertEquals(locationDto, result);
        verify(locationRepository).save(locationEntity);
        verify(entityToDtoMapper).locationToLocationDto(locationEntity);
    }

    @Test
    void deleteAllByVehicleId_shouldDeleteLocations() {
        Long vehicleId = 1L;

        doNothing().when(locationRepository).deleteAllByVehicle_Id(vehicleId);

        locationService.deleteAllByVehicleId(vehicleId);

        verify(locationRepository).deleteAllByVehicle_Id(vehicleId);
    }
}
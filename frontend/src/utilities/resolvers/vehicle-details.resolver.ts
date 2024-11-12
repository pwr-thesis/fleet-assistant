import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { VehiclesService } from '../../app/vehicles/service/vehicles.service';
import { Vehicle } from '../../app/vehicles/types/vehicles';
import { Observable } from 'rxjs';

export const vehicleDetailsResolver: ResolveFn<Observable<Vehicle>> = (
    route
) => {
    const vehicleService = inject(VehiclesService);
    const id = route.paramMap.get('id');
    return vehicleService.getVehicle(id!);
};

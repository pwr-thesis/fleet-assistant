import { Injectable } from '@angular/core';
import { VehiclesHttpService } from './vehicles-http.service';
import { Vehicle, VehicleCreateRequest, VehiclesPage } from '../types/vehicles';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class VehiclesService {
    constructor(private vehiclesHttpService: VehiclesHttpService) {}

    getAllVehicles(): Observable<VehiclesPage> {
        return this.vehiclesHttpService.getAllVehicles();
    }

    createVehicle(
        vehicleCreateRequest: VehicleCreateRequest
    ): Observable<Vehicle> {
        return this.vehiclesHttpService.createVehicle(vehicleCreateRequest);
    }
}

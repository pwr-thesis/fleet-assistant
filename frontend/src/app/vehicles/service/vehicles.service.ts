import { Injectable } from '@angular/core';
import { VehiclesHttpService } from './vehicles-http.service';
import { Vehicle, VehicleCreateRequest, VehiclesPage } from '../types/vehicles';
import { Observable } from 'rxjs';
import { Location } from '../../locations/types/locations';

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

    getVehicle(id: string): Observable<Vehicle> {
        return this.vehiclesHttpService.getVehicle(id);
    }

    getVehicleLocation(id: number): Observable<Location> {
        return this.vehiclesHttpService.getVehicleLocation(id);
    }
}

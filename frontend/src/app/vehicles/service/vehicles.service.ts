import { Injectable } from '@angular/core';
import { VehiclesHttpService } from './vehicles-http.service';
import { Vehicle } from '../types/vehicles';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class VehiclesService {
    constructor(private vehiclesHttpService: VehiclesHttpService) {}

    getAllVehicles(): Observable<Vehicle[]> {
        return this.vehiclesHttpService.getAllVehicles();
    }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Vehicle, VehicleCreateRequest, VehiclesPage } from '../types/vehicles';
import { HttpClient } from '@angular/common/http';
import { VEHICLES_URL } from '../../../utilities/_urls';

@Injectable({
    providedIn: 'root',
})
export class VehiclesHttpService {
    constructor(private http: HttpClient) {}

    getAllVehicles(): Observable<VehiclesPage> {
        return this.http.get(VEHICLES_URL) as Observable<VehiclesPage>;
    }

    createVehicle(
        vehicleCreateRequest: VehicleCreateRequest
    ): Observable<Vehicle> {
        return this.http.post(
            VEHICLES_URL,
            vehicleCreateRequest
        ) as Observable<Vehicle>;
    }
}

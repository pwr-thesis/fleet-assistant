import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Vehicle, VehicleCreateRequest } from '../types/vehicles';
import { HttpClient } from '@angular/common/http';

export const MOCK_VEHICLES: Vehicle[] = [
    {
        id: 1,
        vin: '1HGCM82633A123456',
        plateNumber: 'ABC1234',
        countryCode: 'DE',
        insuranceDate: '2023-02-01',
        lastInspectionDate: '2023-06-10',
        vehicleYear: '2015',
    },
    {
        id: 2,
        vin: '1HGCM82633A654321',
        plateNumber: 'XYZ9876',
        countryCode: 'US',
        insuranceDate: '2022-08-15',
        lastInspectionDate: '2023-01-20',
        vehicleYear: '2018',
    },
    {
        id: 3,
        vin: '1N4AL11D75C123456',
        plateNumber: 'LMN4567',
        countryCode: 'FR',
        insuranceDate: '2023-03-12',
        lastInspectionDate: '2023-07-05',
        vehicleYear: '2017',
    },
    {
        id: 4,
        vin: '1HGCM82633A432156',
        plateNumber: 'PQR6789',
        countryCode: 'IT',
        insuranceDate: '2021-11-30',
        lastInspectionDate: '2022-12-15',
        vehicleYear: '2014',
    },
    {
        id: 5,
        vin: '2HGFB2F59DH123456',
        plateNumber: 'GHI7890',
        countryCode: 'ES',
        insuranceDate: '2022-06-25',
        lastInspectionDate: '2023-05-10',
        vehicleYear: '2019',
    },
];

@Injectable({
    providedIn: 'root',
})
export class VehiclesHttpService {
    constructor(private http: HttpClient) {}

    getAllVehicles(): Observable<Vehicle[]> {
        //TODO API Call to get all user's vehicles
        //return this.http.get(VEHICLES_URL);
        return of(MOCK_VEHICLES);
    }

    createVehicle(vehicleCreateRequest: VehicleCreateRequest): Observable<any> {
        //TODO API Call to create vehicle
        //return this.http.post(VEHICLES_URL, vehicleCreateRequest);
        console.log(vehicleCreateRequest);
        return of();
    }
}

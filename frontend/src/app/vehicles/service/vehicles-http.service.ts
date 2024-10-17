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
        driver: {
            id: 1,
            drivingLicenseNumber: 'DL1',
            drivingLicenseCountryCode: 'US',
            dateOfBirth: '1980-01-01',
            user: {
                name: 'John',
                surname: 'Doe',
                email: 'john.doe@example.com',
                role: 'Driver',
            },
        },
        locations: [{ id: 1, longitude: 17.058006, latitude: 51.110754 }],
    },
    {
        id: 2,
        vin: '1HGCM82633A654321',
        plateNumber: 'XYZ9876',
        countryCode: 'US',
        insuranceDate: '2022-08-15',
        lastInspectionDate: '2023-01-20',
        vehicleYear: '2018',
        driver: {
            id: 2,
            drivingLicenseNumber: 'DL2',
            drivingLicenseCountryCode: 'US',
            dateOfBirth: '1982-01-01',
            user: {
                name: 'Jane',
                surname: 'Doe',
                email: 'jane.doe@example.com',
                role: 'Driver',
            },
        },
        locations: [{ id: 2, longitude: 17.06345, latitude: 51.110285 }],
    },
    {
        id: 3,
        vin: '1N4AL11D75C123456',
        plateNumber: 'LMN4567',
        countryCode: 'FR',
        insuranceDate: '2023-03-12',
        lastInspectionDate: '2023-07-05',
        vehicleYear: '2017',
        driver: {
            id: 3,
            drivingLicenseNumber: 'DL3',
            drivingLicenseCountryCode: 'US',
            dateOfBirth: '1985-01-01',
            user: {
                name: 'Alice',
                surname: 'Smith',
                email: 'alice.smith@example.com',
                role: 'Driver',
            },
        },
        locations: [{ id: 3, longitude: 17.06257, latitude: 51.112313 }],
    },
    {
        id: 4,
        vin: '1HGCM82633A432156',
        plateNumber: 'PQR6789',
        countryCode: 'IT',
        insuranceDate: '2021-11-30',
        lastInspectionDate: '2022-12-15',
        vehicleYear: '2014',
        driver: {
            id: 4,
            drivingLicenseNumber: 'DL4',
            drivingLicenseCountryCode: 'US',
            dateOfBirth: '1990-01-01',
            user: {
                name: 'Bob',
                surname: 'Johnson',
                email: 'bob.johnson@example.com',
                role: 'Driver',
            },
        },
        locations: [{ id: 4, longitude: 17.055268, latitude: 51.112973 }],
    },
    {
        id: 5,
        vin: '2HGFB2F59DH123456',
        plateNumber: 'GHI7890',
        countryCode: 'ES',
        insuranceDate: '2022-06-25',
        lastInspectionDate: '2023-05-10',
        vehicleYear: '2019',
        driver: {
            id: 5,
            drivingLicenseNumber: 'DL5',
            drivingLicenseCountryCode: 'US',
            dateOfBirth: '1995-01-01',
            user: {
                name: 'Charlie',
                surname: 'Brown',
                email: 'charlie.brown@example.com',
                role: 'Driver',
            },
        },
        locations: [{ id: 5, longitude: 17.060965, latitude: 51.107152 }],
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

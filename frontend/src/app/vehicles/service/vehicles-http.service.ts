import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Vehicle } from '../types/vehicles';
import { HttpClient } from '@angular/common/http';

export const MOCK_VEHICLES: Vehicle[] = [
    {
        id: 1,
        vin: '1HGCM82633A123456',
        plateNumber: 'ABC1234',
        countryCode: 'DE',
        driver: {
            id: 101,
            drivingLicenseNumber: 'D12345678',
            drivingLicenseCountryCode: 'DE',
            dateOfBirth: '1985-03-15',
            user: {
                name: 'John',
                surname: 'Doe',
                email: 'john.doe@example.com',
                role: 'Driver',
            },
        },
    },
    {
        id: 2,
        vin: '1HGCM82633A654321',
        plateNumber: 'XYZ9876',
        countryCode: 'US',
        driver: {
            id: 102,
            drivingLicenseNumber: 'U98765432',
            drivingLicenseCountryCode: 'US',
            dateOfBirth: '1990-07-20',
            user: {
                name: 'Jane',
                surname: 'Smith',
                email: 'jane.smith@example.com',
                role: 'Driver',
            },
        },
    },
    {
        id: 3,
        vin: '1N4AL11D75C123456',
        plateNumber: 'LMN4567',
        countryCode: 'FR',
        driver: {
            id: 103,
            drivingLicenseNumber: 'F65432198',
            drivingLicenseCountryCode: 'FR',
            dateOfBirth: '1988-12-10',
            user: {
                name: 'Pierre',
                surname: 'Dupont',
                email: 'pierre.dupont@example.com',
                role: 'Driver',
            },
        },
    },
    {
        id: 4,
        vin: '1HGCM82633A432156',
        plateNumber: 'PQR6789',
        countryCode: 'IT',
        driver: {
            id: 104,
            drivingLicenseNumber: 'I76543210',
            drivingLicenseCountryCode: 'IT',
            dateOfBirth: '1975-05-01',
            user: {
                name: 'Marco',
                surname: 'Rossi',
                email: 'marco.rossi@example.com',
                role: 'Driver',
            },
        },
    },
    {
        id: 5,
        vin: '2HGFB2F59DH123456',
        plateNumber: 'GHI7890',
        countryCode: 'ES',
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
}

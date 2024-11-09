import { Injectable } from '@angular/core';
import { DriversHttpService } from './drivers-http.service';
import { Observable, of } from 'rxjs';
import { Driver, DriverCreateRequest, DriversPage } from '../types/drivers';

@Injectable({
    providedIn: 'root',
})
export class DriversService {
    constructor(private driversHttpService: DriversHttpService) {}

    drivers = [
        {
            id: '1',
            name: 'John',
            surname: 'Doe',
            email: 'john.doe@example.com',
            role: 'driver',
            drivingLicenseNumber: 'D1234567',
            drivingLicenseCountryCode: 'US',
            birthDate: ['1990', '04', '15'],
            isInRegisterProcess: false,
        },
        {
            id: '2',
            name: 'Anna',
            surname: 'Smith',
            email: 'anna.smith@example.com',
            role: 'driver',
            drivingLicenseNumber: 'A9876543',
            drivingLicenseCountryCode: 'GB',
            birthDate: ['1985', '08', '22'],
            isInRegisterProcess: true,
        },
        {
            id: '3',
            name: 'Hans',
            surname: 'Müller',
            email: 'hans.muller@example.de',
            role: 'driver',
            drivingLicenseNumber: 'H5678901',
            drivingLicenseCountryCode: 'DE',
            birthDate: ['1978', '12', '05'],
            isInRegisterProcess: false,
        },
        {
            id: '4',
            name: 'Carlos',
            surname: 'Garcia',
            email: 'carlos.garcia@example.es',
            role: 'driver',
            drivingLicenseNumber: 'C3456789',
            drivingLicenseCountryCode: 'ES',
            birthDate: ['1995', '06', '30'],
            isInRegisterProcess: false,
        },
        {
            id: '5',
            name: 'Emily',
            surname: 'Johnson',
            email: 'emily.johnson@example.com',
            role: 'driver',
            drivingLicenseNumber: 'J2345678',
            drivingLicenseCountryCode: 'CA',
            birthDate: ['1992', '03', '10'],
            isInRegisterProcess: false,
        },
    ];

    //TODO: CONNECT TO BACKEND
    getAllDrivers(): Observable<DriversPage> {
        //return this.driversHttpService.getAllDrivers();
        return of({ content: this.drivers });
    }

    //TODO: CONNECT TO BACKEND
    createDriver(driverCreateRequest: DriverCreateRequest): Observable<Driver> {
        return this.driversHttpService.createDriver(driverCreateRequest);
    }
}

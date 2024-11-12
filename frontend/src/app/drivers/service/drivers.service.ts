import { Injectable } from '@angular/core';
import { DriversHttpService } from './drivers-http.service';
import {Observable} from 'rxjs';
import { DriverCreateRequest, DriversPage } from '../types/drivers';

@Injectable({
    providedIn: 'root',
})
export class DriversService {
    constructor(private driversHttpService: DriversHttpService) {}

    getAllDrivers(registered: boolean): Observable<DriversPage> {
        return this.driversHttpService.getAllDrivers(registered);
    }

    createDriver(driverCreateRequest: DriverCreateRequest): Observable<string> {
        return this.driversHttpService.createDriver(driverCreateRequest);
    }
}

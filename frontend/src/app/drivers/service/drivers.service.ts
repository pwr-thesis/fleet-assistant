import { Injectable } from '@angular/core';
import { DriversHttpService } from './drivers-http.service';
import { Observable } from 'rxjs';
import {
    Driver,
    DriverCreateRequest,
    DriverSearch,
    DriversPage,
} from '../types/drivers';
import { Pageable } from '../../vehicles/types/vehicles';

@Injectable({
    providedIn: 'root',
})
export class DriversService {
    constructor(private driversHttpService: DriversHttpService) {}

    getAllDrivers(
        pageable: Pageable,
        driverSearch: DriverSearch
    ): Observable<DriversPage> {
        return this.driversHttpService.getAllDrivers(pageable, driverSearch);
    }

    getRegisteredDrivers(): Observable<Driver[]> {
        return this.driversHttpService.getRegisteredDrivers();
    }

    createDriver(driverCreateRequest: DriverCreateRequest): Observable<string> {
        return this.driversHttpService.createDriver(driverCreateRequest);
    }
}

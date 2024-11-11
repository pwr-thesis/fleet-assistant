import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {DRIVERS_URL, GET_DRIVERS_URL} from '../../../utilities/_urls';
import { Driver, DriverCreateRequest, DriversPage } from '../types/drivers';

@Injectable({
    providedIn: 'root',
})
export class DriversHttpService {
    constructor(private http: HttpClient) {}

    getAllDrivers(registered: boolean): Observable<DriversPage> {
        return this.http.get(GET_DRIVERS_URL(registered)) as Observable<DriversPage>;
    }

    createDriver(driverCreateRequest: DriverCreateRequest): Observable<Driver> {
        return this.http.post(
            DRIVERS_URL,
            driverCreateRequest
        ) as Observable<Driver>;
    }
}

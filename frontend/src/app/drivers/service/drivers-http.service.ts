import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DRIVERS_URL } from '../../../utilities/_urls';
import { Driver, DriverCreateRequest, DriversPage } from '../types/drivers';

@Injectable({
    providedIn: 'root',
})
export class DriversHttpService {
    constructor(private http: HttpClient) {}

    //TODO: CONNECT TO BACKEND
    getAllDrivers(): Observable<DriversPage> {
        return this.http.get(DRIVERS_URL) as Observable<DriversPage>;
    }

    //TODO: CONNECT TO BACKEND
    createDriver(driverCreateRequest: DriverCreateRequest): Observable<Driver> {
        return this.http.post(
            DRIVERS_URL,
            driverCreateRequest
        ) as Observable<Driver>;
    }
}

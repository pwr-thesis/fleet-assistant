import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
    DRIVERS_URL,
    GET_DRIVERS_URL,
    GET_REGISTERED_DRIVERS_URL,
} from '../../../utilities/_urls';
import { Driver, DriverCreateRequest, DriversPage } from '../types/drivers';
import { Pageable } from '../../vehicles/types/vehicles';

@Injectable({
    providedIn: 'root',
})
export class DriversHttpService {
    constructor(private http: HttpClient) {}

    getAllDrivers(pageable: Pageable): Observable<DriversPage> {
        return this.http.get(
            GET_DRIVERS_URL(pageable)
        ) as Observable<DriversPage>;
    }

    getRegisteredDrivers(): Observable<Driver[]> {
        return this.http.get(GET_REGISTERED_DRIVERS_URL) as Observable<
            Driver[]
        >;
    }

    createDriver(driverCreateRequest: DriverCreateRequest): Observable<string> {
        return this.http.post<string>(DRIVERS_URL, driverCreateRequest, {
            responseType: 'text' as 'json',
        }) as Observable<string>;
    }
}

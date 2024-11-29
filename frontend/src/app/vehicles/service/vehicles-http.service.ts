import {Injectable, NgZone} from '@angular/core';
import { Observable } from 'rxjs';
import {
    Pageable,
    Vehicle,
    VehicleCreateRequest,
    VehicleSearch,
    VehiclesPage,
} from '../types/vehicles';
import { HttpClient } from '@angular/common/http';
import {
    ASSIGN_DRIVER,
    GET_ALL_VEHICLES_URL,
    GET_VEHICLE_BY_ID_URL,
    GET_VEHICLE_LIVE_LOCATION_BY_ID_URL,
    VEHICLES_URL,
} from '../../../utilities/_urls';
import { Location } from '../../locations/types/locations';

@Injectable({
    providedIn: 'root',
})
export class VehiclesHttpService {
    constructor(private http: HttpClient, private ngZone: NgZone) {}

    getAllVehicles(
        pageable: Pageable,
        vehicleSearch: VehicleSearch
    ): Observable<VehiclesPage> {
        return this.http.post(
            GET_ALL_VEHICLES_URL(pageable),
            vehicleSearch
        ) as Observable<VehiclesPage>;
    }

    createVehicle(
        vehicleCreateRequest: VehicleCreateRequest
    ): Observable<Vehicle> {
        return this.http.post(
            VEHICLES_URL,
            vehicleCreateRequest
        ) as Observable<Vehicle>;
    }

    getVehicle(id: string): Observable<Vehicle> {
        return this.http.get(GET_VEHICLE_BY_ID_URL(id)) as Observable<Vehicle>;
    }

    getVehicleLocation(id: number): Observable<Location> {
        return new Observable((observer) => {
            const url = GET_VEHICLE_LIVE_LOCATION_BY_ID_URL(id.toString());
            const eventSource = new EventSource(url);
            eventSource.onmessage = (event): void => {
                this.ngZone.run(() => {
                    const location = JSON.parse(event.data);
                    observer.next(location);
                });
            };
            eventSource.onerror = (error): void => {
                this.ngZone.run(() => {
                    observer.error(error);
                });
            };
            return () => {
                eventSource.close();
            };
        });
    }

    assignDriver(vehicleId: string, driverId: string): Observable<Vehicle> {
        return this.http.post(
            ASSIGN_DRIVER(vehicleId, driverId),
            undefined
        ) as Observable<Vehicle>;
    }
}

import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import {
    Pageable,
    Vehicle,
    VehicleCreateRequest,
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
    constructor(
        private http: HttpClient,
        private ngZone: NgZone
    ) {}

    getAllVehicles(pageable: Pageable): Observable<VehiclesPage> {
        return this.http.get(
            GET_ALL_VEHICLES_URL(pageable)
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
            const token = localStorage.getItem('accessToken');

            fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'text/event-stream',
                },
            })
                .then((response) => {
                    const reader = response.body?.getReader();

                    if (!reader) {
                        observer.error('Failed to read the stream');
                        return;
                    }

                    function processStream(): void {
                        reader!
                            .read()
                            .then(({ done, value }) => {
                                if (done) {
                                    observer.complete();
                                    return;
                                }

                                const chunk = new TextDecoder().decode(value);
                                const events = chunk.split('\n\n'); // SSE events are separated by double newlines

                                events.forEach((event) => {
                                    if (event.startsWith('data:')) {
                                        const data = event
                                            .replace('data:', '')
                                            .trim();
                                        const location = JSON.parse(data);
                                        observer.next(location);
                                    }
                                });

                                processStream();
                            })
                            .catch((error) => {
                                observer.error(error);
                            });
                    }

                    processStream();
                })
                .catch((error) => observer.error(error));
        });
    }

    assignDriver(vehicleId: string, driverId: string): Observable<Vehicle> {
        return this.http.post(
            ASSIGN_DRIVER(vehicleId, driverId),
            undefined
        ) as Observable<Vehicle>;
    }
}

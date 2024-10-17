import { Component, DestroyRef, OnInit } from '@angular/core';
import { GoogleMap, MapAdvancedMarker } from '@angular/google-maps';
import { Vehicle } from '../../../vehicles/types/vehicles';
import { VehiclesService } from '../../../vehicles/service/vehicles.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CustomMarker, Location } from '../../types/locations';
import { mapOptions } from '../../_helpers';
import { NgForOf, NgIf } from '@angular/common';
import { VehicleCardComponent } from '../../../vehicles/components/vehicle-card/vehicle-card.component';

@Component({
    selector: 'app-all-locations',
    standalone: true,
    imports: [
        GoogleMap,
        NgForOf,
        MapAdvancedMarker,
        VehicleCardComponent,
        NgIf,
    ],
    templateUrl: './all-locations.component.html',
    styleUrl: './all-locations.component.scss',
})
export class AllLocationsComponent implements OnInit {
    mapInitialZoom = 15;
    mapInitialCenter!: google.maps.LatLngLiteral;
    selectedVehicle: Vehicle | undefined;
    selectedMarkerContent: Node;

    private vehicles: Vehicle[] | undefined;

    constructor(
        private vehicleService: VehiclesService,
        private destroyRef: DestroyRef
    ) {
        const imgTag = document.createElement('img');
        imgTag.src = 'car-icon-clicked.png';
        this.selectedMarkerContent = imgTag;
    }

    ngOnInit(): void {
        //TODO, CHECK WHEN CAR ENDPOINT WILL BE IMPLEMENTED
        this.vehicleService
            .getAllVehicles()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((response) => {
                this.vehicles = response;
                this.mapInitialCenter = {
                    lat: this.vehicles[0].locations[
                        this.vehicles[0].locations.length - 1
                    ].latitude,
                    lng: this.vehicles[0].locations[
                        this.vehicles[0].locations.length - 1
                    ].longitude,
                };
            });
    }

    getMarkers(): CustomMarker[] {
        return this.vehicles!.map((vehicle) => {
            const lastLocation: Location =
                vehicle.locations[vehicle.locations.length - 1];
            const imgTag = document.createElement('img');
            imgTag.src = 'car-icon.png';
            return {
                position: {
                    lat: lastLocation.latitude,
                    lng: lastLocation.longitude,
                },
                vehicle: vehicle,
                content: imgTag,
            };
        });
    }

    onMarkerClick(marker: CustomMarker): void {
        this.selectedVehicle = marker.vehicle;
    }

    protected readonly mapOptions = mapOptions;
}

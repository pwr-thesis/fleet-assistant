import { Component, DestroyRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Vehicle } from '../../types/vehicles';
import { toDisplayDate } from '../../../../utilities/date-utils';
import { mapOptions } from '../../../locations/_helpers';
import { GoogleMap, MapAdvancedMarker } from '@angular/google-maps';
import { NgForOf } from '@angular/common';
import { VehiclesService } from '../../service/vehicles.service';
import { Location } from '../../../locations/types/locations';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
    selector: 'app-vehicle-details',
    standalone: true,
    imports: [GoogleMap, MapAdvancedMarker, NgForOf],
    templateUrl: './vehicle-details.component.html',
})
export class VehicleDetailsComponent implements OnInit {
    vehicle!: Vehicle;
    mapInitialZoom = 15;
    mapInitialCenter!: google.maps.LatLngLiteral;
    icon: Node;
    location!: Location;

    constructor(
        private route: ActivatedRoute,
        private vehiclesService: VehiclesService,
        private destroyRef: DestroyRef
    ) {
        const imgTag = document.createElement('img');
        imgTag.src = 'car-icon.png';
        this.icon = imgTag;
    }

    ngOnInit(): void {
        this.vehicle = this.route.snapshot.data['vehicle'];
        this.mapInitialCenter = {
            lat: this.vehicle.locations[this.vehicle.locations.length - 1]
                ?.latitude,
            lng: this.vehicle.locations[this.vehicle.locations.length - 1]
                ?.longitude,
        };
        this.vehiclesService
            .getVehicleLocation(this.vehicle.id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((location: Location) => {
                this.location = location;
            });
    }

    getVehicleLastLocation(): google.maps.LatLngLiteral {
        return { lat: this.location.latitude, lng: this.location.longitude };
    }

    protected readonly toDisplayDate = toDisplayDate;
    protected readonly mapOptions = mapOptions;
}

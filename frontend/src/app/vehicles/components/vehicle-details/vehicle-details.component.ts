import { Component, DestroyRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Vehicle } from '../../types/vehicles';
import { toDisplayDate } from '../../../../utilities/date-utils';
import { mapOptions } from '../../../locations/_helpers';
import { GoogleMap, MapAdvancedMarker } from '@angular/google-maps';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { VehiclesService } from '../../service/vehicles.service';
import { Location } from '../../../locations/types/locations';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatOption,
} from '@angular/material/autocomplete';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Driver } from '../../../drivers/types/drivers';
import { map, Observable, startWith } from 'rxjs';
import { DriversService } from '../../../drivers/service/drivers.service';
import { MatButton } from '@angular/material/button';
import { INVALID_FORM_MESSAGE } from '../../../../utilities/_constants';
import { SnackbarService } from '../../../../utilities/services/snackbar.service';
import {Title} from "@angular/platform-browser";
@Component({
    selector: 'app-vehicle-details',
    standalone: true,
    imports: [
        GoogleMap,
        MapAdvancedMarker,
        NgForOf,
        AsyncPipe,
        MatAutocomplete,
        MatAutocompleteTrigger,
        MatInput,
        MatOption,
        ReactiveFormsModule,
        MatButton,
        NgIf,
        MatFormField,
        MatLabel,
    ],
    templateUrl: './vehicle-details.component.html',
})
export class VehicleDetailsComponent implements OnInit {
    vehicle!: Vehicle;
    mapInitialZoom = 15;
    mapInitialCenter: google.maps.LatLngLiteral | undefined;
    icon: Node;
    location!: Location;
    drivers: Driver[] = [];
    filteredDrivers!: Observable<Driver[]>;
    assignDriverForm!: FormGroup;

    constructor(
        private route: ActivatedRoute,
        private vehiclesService: VehiclesService,
        private destroyRef: DestroyRef,
        private driverService: DriversService,
        private snackbarService: SnackbarService,
        private titleService: Title
    ) {
        const imgTag = document.createElement('img');
        imgTag.src = 'car-icon.png';
        this.icon = imgTag;
    }

    ngOnInit(): void {
        this.vehicle = this.route.snapshot.data['vehicle'];

        this.assignDriverForm = new FormGroup({
            driver: new FormControl(
                this.vehicle.driver ?? '',
                Validators.required
            ),
        });

        if (this.vehicle.locations) {
            this.mapInitialCenter = {
                lat: this.vehicle.locations[this.vehicle.locations.length - 1]
                    ?.latitude,
                lng: this.vehicle.locations[this.vehicle.locations.length - 1]
                    ?.longitude,
            };
        }

        this.vehiclesService
            .getVehicleLocation(this.vehicle.id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((location: Location) => {
                this.location = location;
            });
        this.driverService
            .getRegisteredDrivers()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((response) => {
                this.drivers = response;
            });
        this.filteredDrivers = this.assignDriverForm.controls[
            'driver'
        ].valueChanges.pipe(
            startWith(''),
            map((value) => {
                const name =
                    typeof value === 'string'
                        ? value
                        : this.getDriverText(value);
                return name
                    ? this._filter(name as string)
                    : this.drivers.slice();
            })
        );
        this.titleService.setTitle('FA - ' + this.vehicle.name);
    }

    getVehicleLastLocation(location: Location): google.maps.LatLngLiteral {
        return { lat: location.latitude, lng: location.longitude };
    }

    onAssignDriver(): void {
        const driver = this.assignDriverForm.value.driver;
        this.vehiclesService
            .assignDriver(this.vehicle.id.toString(), driver.id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(
                () => {
                    this.snackbarService.openSnackBar(
                        'New driver was assigned!'
                    );
                    setTimeout(() => window.location.reload(), 1000);
                },
                () => {
                    this.snackbarService.openSnackBar(INVALID_FORM_MESSAGE);
                }
            );
    }

    getDriverText(driver: Driver): string {
        return driver.name + ' ' + driver.surname + ', ' + driver.email;
    }

    displayFn(driver: Driver): string {
        return driver
            ? driver.name + ' ' + driver.surname + ', ' + driver.email
            : '';
    }

    isNewDriverSelected(): boolean {
        const driver = this.assignDriverForm.value.driver;
        return driver.id && driver !== this.vehicle.driver;
    }

    private _filter(name: string): Driver[] {
        const filterValue = name.toLowerCase();
        return this.drivers.filter((driver) =>
            this.getDriverText(driver).toLowerCase().includes(filterValue)
        );
    }

    protected readonly toDisplayDate = toDisplayDate;
    protected readonly mapOptions = mapOptions;
}

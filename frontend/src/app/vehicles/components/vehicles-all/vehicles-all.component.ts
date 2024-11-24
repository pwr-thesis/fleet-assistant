import {
    Component,
    DestroyRef,
    ElementRef,
    OnInit,
    ViewChild,
} from '@angular/core';
import { VehicleCardComponent } from '../vehicle-card/vehicle-card.component';
import { NgForOf, NgIf } from '@angular/common';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { Vehicle, VehicleSearch } from '../../types/vehicles';
import { RouterLink } from '@angular/router';
import { VehiclesService } from '../../service/vehicles.service';
import { AuthService } from '../../../auth/service/auth.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import {
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatOption,
} from '@angular/material/autocomplete';
import { Driver } from '../../../drivers/types/drivers';
import { DriversService } from '../../../drivers/service/drivers.service';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-vehicles-all',
    standalone: true,
    templateUrl: './vehicles-all.component.html',
    styleUrl: './vehicles-all.component.scss',
    imports: [
        VehicleCardComponent,
        NgForOf,
        NgIf,
        MatCard,
        MatCardContent,
        MatIcon,
        RouterLink,
        MatPaginator,
        ReactiveFormsModule,
        MatFormField,
        MatInput,
        MatLabel,
        MatAutocomplete,
        MatAutocompleteTrigger,
        MatOption,
        MatButton,
    ],
})
export class VehiclesAllComponent implements OnInit {
    @ViewChild('driverInput') driverInput!: ElementRef<HTMLInputElement>;
    vehicles: Vehicle[] | undefined;
    totalElements = 0;
    pageIndex = 0;
    pageSize = 4;
    pageSizeOptions = [2, 4, 9, 14];

    vehicleSearchForm!: FormGroup;
    drivers: (Driver | string)[] = [];
    filteredDrivers!: (Driver | string)[];

    constructor(
        private vehiclesService: VehiclesService,
        private authService: AuthService,
        private destroyRef: DestroyRef,
        private driverService: DriversService
    ) {
        this.vehicleSearchForm = new FormGroup({
            name: new FormControl(''),
            countryCode: new FormControl(''),
            driver: new FormControl(''),
        });
    }

    ngOnInit(): void {
        this.getVehicles();

        this.driverService
            .getRegisteredDrivers()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((response) => {
                this.drivers = response;
                this.drivers.push('Not assigned');
            });

        this.filteredDrivers = this.drivers.slice();
    }

    handlePageEvent(e: PageEvent): void {
        this.pageSize = e.pageSize;
        this.pageIndex = e.pageIndex;
        this.getVehicles();
    }

    isDriver(): boolean {
        return !this.authService.isManager();
    }

    onSearch(): void {
        this.pageIndex = 0;
        this.getVehicles();
    }

    onReset(): void {
        this.vehicleSearchForm.reset();
        this.pageIndex = 0;
        this.getVehicles();
    }

    getDriverText(driver: Driver | string): string {
        if (typeof driver === 'string') {
            return 'Not assigned';
        }
        return driver.name + ' ' + driver.surname + ', ' + driver.email;
    }

    displayFn(driver: Driver | string): string {
        if (typeof driver === 'string') {
            return driver;
        }
        return driver
            ? driver.name + ' ' + driver.surname + ', ' + driver.email
            : '';
    }

    filter(): void {
        const filterValue = this.driverInput.nativeElement.value.toLowerCase();
        this.filteredDrivers = this.drivers.filter((driver) =>
            this.getDriverText(driver).toLowerCase().includes(filterValue)
        );
    }

    private getVehicles(): void {
        const vehicleSearch = this.getVehicleSearchParams();

        this.vehiclesService
            .getAllVehicles(
                {
                    pageNumber: this.pageIndex,
                    pageSize: this.pageSize,
                },
                vehicleSearch
            )
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((page) => {
                this.vehicles = page.content;
                this.totalElements = page.totalElements;
            });
    }

    private getVehicleSearchParams(): VehicleSearch {
        const vehicleSearchFormValue = this.vehicleSearchForm.value;
        return {
            name:
                vehicleSearchFormValue.name === ''
                    ? null
                    : vehicleSearchFormValue.name,
            countryCode:
                vehicleSearchFormValue.countryCode === ''
                    ? null
                    : vehicleSearchFormValue.countryCode,
            driverId:
                vehicleSearchFormValue.driver &&
                vehicleSearchFormValue.driver !== 'Not assigned'
                    ? vehicleSearchFormValue.driver.id
                    : null,
            isDriverAssigned:
                vehicleSearchFormValue.driver === 'Not assigned'
                    ? false
                    : undefined,
        };
    }
}

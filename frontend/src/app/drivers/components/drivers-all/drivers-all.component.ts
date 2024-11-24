import { Component, DestroyRef, OnInit } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { Driver, DriverSearch } from '../../types/drivers';
import { DriversService } from '../../service/drivers.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { DriverCardComponent } from '../driver-card/driver-card.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import {
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatOption,
} from '@angular/material/autocomplete';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

@Component({
    selector: 'app-drivers-all',
    standalone: true,
    imports: [
        NgIf,
        RouterLink,
        DriverCardComponent,
        NgForOf,
        MatPaginator,
        FormsModule,
        MatAutocomplete,
        MatAutocompleteTrigger,
        MatButton,
        MatFormField,
        MatInput,
        MatLabel,
        MatOption,
        ReactiveFormsModule,
    ],
    styleUrl: './drivers-all.component.scss',
    templateUrl: './drivers-all.component.html',
})
export class DriversAllComponent implements OnInit {
    drivers!: Driver[];
    totalElements = 0;
    pageIndex = 0;
    pageSize = 4;
    pageSizeOptions = [2, 4, 9, 14];

    driverSearchForm!: FormGroup;

    constructor(
        private driversService: DriversService,
        private destroyRef: DestroyRef
    ) {
        this.driverSearchForm = new FormGroup({
            name: new FormControl(''),
            surname: new FormControl(''),
            email: new FormControl(''),
        });
    }

    ngOnInit(): void {
        this.getDrivers();
    }

    handlePageEvent(e: PageEvent): void {
        this.pageSize = e.pageSize;
        this.pageIndex = e.pageIndex;

        this.getDrivers();
    }

    onSearch(): void {
        this.pageIndex = 0;
        this.getDrivers();
    }

    onReset(): void {
        this.driverSearchForm.reset();
        this.pageIndex = 0;
        this.getDrivers();
    }

    private getDrivers(): void {
        const driverSearch = this.getDriverSearchParams();

        this.driversService
            .getAllDrivers(
                {
                    pageNumber: this.pageIndex,
                    pageSize: this.pageSize,
                },
                driverSearch
            )
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((page) => {
                this.drivers = page.content;
                this.totalElements = page.totalElements;
            });
    }

    private getDriverSearchParams(): DriverSearch {
        const driverSearchFormValue = this.driverSearchForm.value;
        return {
            name:
                driverSearchFormValue.name === ''
                    ? null
                    : driverSearchFormValue.name,
            surname:
                driverSearchFormValue.surname === ''
                    ? null
                    : driverSearchFormValue.surname,
            email:
                driverSearchFormValue.email === ''
                    ? null
                    : driverSearchFormValue.email,
        };
    }
}

import { Component, DestroyRef, OnInit } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { Driver } from '../../types/drivers';
import { DriversService } from '../../service/drivers.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AddCardComponent } from '../../../common/components/add-card/add-card.component';
import { RouterLink } from '@angular/router';
import { DriverCardComponent } from '../driver-card/driver-card.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
    selector: 'app-drivers-all',
    standalone: true,
    imports: [
        NgIf,
        AddCardComponent,
        RouterLink,
        DriverCardComponent,
        NgForOf,
        MatPaginator,
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

    constructor(
        private driversService: DriversService,
        private destroyRef: DestroyRef
    ) {}

    ngOnInit(): void {
        this.driversService
            .getAllDrivers({
                pageNumber: this.pageIndex,
                pageSize: this.pageSize,
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((page) => {
                this.drivers = page.content;
                this.totalElements = page.totalElements;
            });
    }

    handlePageEvent(e: PageEvent): void {
        this.pageSize = e.pageSize;
        this.pageIndex = e.pageIndex;

        this.driversService
            .getAllDrivers({
                pageNumber: this.pageIndex,
                pageSize: this.pageSize,
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((page) => {
                this.drivers = page.content;
                this.totalElements = page.totalElements;
            });
    }
}

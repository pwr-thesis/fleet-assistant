import { Component, DestroyRef, OnInit } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { Driver } from '../../types/drivers';
import { DriversService } from '../../service/drivers.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AddCardComponent } from '../../../common/components/add-card/add-card.component';
import { RouterLink } from '@angular/router';
import { DriverCardComponent } from '../driver-card/driver-card.component';

@Component({
    selector: 'app-drivers-all',
    standalone: true,
    imports: [NgIf, AddCardComponent, RouterLink, DriverCardComponent, NgForOf],
    templateUrl: './drivers-all.component.html',
})
export class DriversAllComponent implements OnInit {
    drivers: Driver[] = [];

    constructor(
        private driversService: DriversService,
        private destroyRef: DestroyRef
    ) {}

    ngOnInit(): void {
        this.driversService
            .getAllDrivers(false)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => {
                this.drivers = result.content;
            });
    }
}

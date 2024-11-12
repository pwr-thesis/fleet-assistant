import { Component, OnInit } from '@angular/core';
import { VehicleCardComponent } from '../vehicle-card/vehicle-card.component';
import { NgForOf, NgIf } from '@angular/common';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { Vehicle } from '../../types/vehicles';
import { AddCardComponent } from '../../../common/components/add-card/add-card.component';
import { RouterLink } from '@angular/router';
import { VehiclesService } from '../../service/vehicles.service';
import { AuthService } from '../../../auth/service/auth.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

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
        AddCardComponent,
        RouterLink,
        MatPaginator,
    ],
})
export class VehiclesAllComponent implements OnInit {
    vehicles: Vehicle[] | undefined;
    totalElements = 0;
    pageIndex = 0;
    pageSize = 4;
    pageSizeOptions = [2, 4, 9, 14];

    constructor(
        private vehiclesService: VehiclesService,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
        this.vehiclesService
            .getAllVehicles({
                pageNumber: this.pageIndex,
                pageSize: this.pageSize,
            })
            .subscribe((page) => {
                this.vehicles = page.content;
                this.totalElements = page.totalElements;
            });
    }

    handlePageEvent(e: PageEvent): void {
        this.pageSize = e.pageSize;
        this.pageIndex = e.pageIndex;

        this.vehiclesService
            .getAllVehicles({
                pageNumber: this.pageIndex,
                pageSize: this.pageSize,
            })
            .subscribe((page) => {
                this.vehicles = page.content;
                this.totalElements = page.totalElements;
            });
    }

    isDriver(): boolean {
        return !this.authService.isManager();
    }
}

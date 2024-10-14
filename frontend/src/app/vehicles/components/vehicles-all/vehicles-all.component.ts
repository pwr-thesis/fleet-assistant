import { Component, OnInit } from '@angular/core';
import { VehicleCardComponent } from '../vehicle-card/vehicle-card.component';
import { NgForOf, NgIf } from '@angular/common';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { Vehicle } from '../../types/vehicles';
import { VehicleAddCardComponent } from '../vehicle-card/vehicle-add-card/vehicle-add-card.component';
import { RouterLink } from '@angular/router';
import { VehiclesService } from '../../service/vehicles.service';

@Component({
    selector: 'app-vehicles-all',
    standalone: true,
    templateUrl: './vehicles-all.component.html',
    imports: [
        VehicleCardComponent,
        NgForOf,
        NgIf,
        MatCard,
        MatCardContent,
        MatIcon,
        VehicleAddCardComponent,
        RouterLink,
    ],
})
export class VehiclesAllComponent implements OnInit {
    vehicles: Vehicle[] | undefined;

    constructor(private vehiclesService: VehiclesService) {}

    ngOnInit(): void {
        this.vehiclesService.getAllVehicles().subscribe((vehicles) => {
            this.vehicles = vehicles;
        });
    }
}

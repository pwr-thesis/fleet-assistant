import { Component, Input } from '@angular/core';
import {
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle,
} from '@angular/material/card';
import { Vehicle } from '../../types/vehicles';
import { CardFieldComponent } from '../../../common/components/card-field/card-field.component';
import { toDisplayDate } from '../../../../utilities/date-utils';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-vehicle-card',
    standalone: true,
    imports: [
        MatCard,
        MatCardContent,
        MatCardHeader,
        MatCardSubtitle,
        MatCardTitle,
        CardFieldComponent,
        RouterLink,
        NgIf,
    ],
    templateUrl: './vehicle-card.component.html',
    styleUrl: './vehicle-card.component.scss',
})
export class VehicleCardComponent {
    @Input() vehicle!: Vehicle;
    @Input() isDriver!: boolean;

    getDriverName(): string {
        if (this.vehicle.driver) {
            return (
                ' ' +
                this.vehicle.driver.name +
                ' ' +
                this.vehicle.driver.surname
            );
        }
        return ' N/A';
    }

    protected readonly toDisplayDate = toDisplayDate;
}

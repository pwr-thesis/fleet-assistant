import { Component, Input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle,
} from '@angular/material/card';
import { Vehicle } from '../../types/vehicles';
import { VehicleCardFieldComponent } from './vehicle-card-field/vehicle-card-field.component';
import { toDisplayDate } from '../../../../utilities/date-utils';

@Component({
    selector: 'app-vehicle-card',
    standalone: true,
    imports: [
        MatButton,
        MatCard,
        MatCardActions,
        MatCardContent,
        MatCardHeader,
        MatCardSubtitle,
        MatCardTitle,
        VehicleCardFieldComponent,
    ],
    templateUrl: './vehicle-card.component.html',
    styleUrl: './vehicle-card.component.scss',
})
export class VehicleCardComponent {
    @Input() vehicle!: Vehicle;

    getDriverName(): string {
        if (this.vehicle.driver) {
            return (
                ' ' +
                this.vehicle.driver.user.name +
                ' ' +
                this.vehicle.driver.user.surname
            );
        }
        return ' N/A';
    }

    protected readonly toDisplayDate = toDisplayDate;
}

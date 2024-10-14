import { Component } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';

@Component({
    selector: 'app-vehicle-add-card',
    standalone: true,
    imports: [MatCard, MatCardContent],
    templateUrl: './vehicle-add-card.component.html',
    styleUrl: './vehicle-add-card.component.scss',
})
export class VehicleAddCardComponent {}

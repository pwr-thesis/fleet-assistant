import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-vehicle-card-field',
    standalone: true,
    imports: [],
    templateUrl: './vehicle-card-field.component.html',
})
export class VehicleCardFieldComponent {
    @Input() fieldName!: string;
    @Input() fieldValue!: string;
}

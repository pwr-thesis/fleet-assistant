import { Component } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import {
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatOption,
} from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { of } from 'rxjs';

@Component({
    selector: 'app-vehicle-create',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatButton,
        MatFormField,
        MatInput,
        MatLabel,
        MatAutocomplete,
        MatOption,
        MatAutocompleteTrigger,
        AsyncPipe,
    ],
    templateUrl: './vehicle-create.component.html',
    styleUrl: './vehicle-create.component.scss',
})
export class VehicleCreateComponent {
    createVehicleForm!: FormGroup;

    constructor() {
        this.createVehicleForm = new FormGroup({
            vin: new FormControl('', Validators.required),
            plateNumber: new FormControl('', Validators.required),
            countryCode: new FormControl('', Validators.required),
            driver: new FormControl(''),
        });
    }

    onCreateVehicle(): void {
        return;
    }

    protected readonly of = of;
}

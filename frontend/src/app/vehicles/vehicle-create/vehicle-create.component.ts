import { Component, DestroyRef } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
    MatError,
    MatFormField,
    MatHint,
    MatLabel,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import {
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatOption,
} from '@angular/material/autocomplete';
import { Driver, VehicleCreateRequest } from '../types/vehicles';
import {
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
} from '@angular/material/datepicker';
import { MatIcon } from '@angular/material/icon';
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { SnackbarService } from '../../../utilities/services/snackbar.service';
import { INVALID_FORM_MESSAGE } from '../../../utilities/_constants';
import { NgIf } from '@angular/common';
import {
    futureDateValidator,
    pastDateValidator,
    yearValidator,
} from '../_helpers';
import { Router, RouterLink } from '@angular/router';
import { VehiclesService } from '../service/vehicles.service';
import moment from 'moment/moment';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const MY_DATE_FORMAT = {
    parse: {
        dateInput: 'DD/MM/YYYY',
    },
    display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'MMMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

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
        MatDatepickerInput,
        MatDatepickerToggle,
        MatDatepicker,
        MatHint,
        NgIf,
        MatIcon,
        MatError,
        RouterLink,
    ],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE],
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
    ],
    templateUrl: './vehicle-create.component.html',
    styleUrl: './vehicle-create.component.scss',
})
export class VehicleCreateComponent {
    createVehicleForm!: FormGroup;
    drivers: Driver[] = [];

    constructor(
        private router: Router,
        private snackBarService: SnackbarService,
        private vehicleService: VehiclesService,
        private destroyRef: DestroyRef
    ) {
        this.createVehicleForm = new FormGroup({
            vin: new FormControl('', [
                Validators.required,
                Validators.maxLength(17),
                Validators.minLength(17),
            ]),
            plateNumber: new FormControl('', Validators.required),
            countryCode: new FormControl('', Validators.required),
            vehicleYear: new FormControl('', [
                Validators.required,
                yearValidator(),
            ]),
            insuranceDate: new FormControl('', [
                Validators.required,
                futureDateValidator(),
            ]),
            lastVehicleInspectionDate: new FormControl('', [
                Validators.required,
                pastDateValidator(),
            ]),
            driver: new FormControl(''),
        });
    }

    onCreateVehicle(): void {
        if (this.createVehicleForm.valid) {
            const vehicleFormValue = this.createVehicleForm.value;
            const vehicleCreateRequest: VehicleCreateRequest = {
                vin: vehicleFormValue.vin,
                plateNumber: vehicleFormValue.plateNumber,
                countryCode: vehicleFormValue.countryCode,
                insuranceDate: moment(vehicleFormValue.insuranceDate).format(
                    'YYYY-MM-DD'
                ),
                lastInspectionDate: moment(
                    vehicleFormValue.lastVehicleInspectionDate
                ).format('YYYY-MM-DD'),
                vehicleYear: vehicleFormValue.vehicleYear,
            };

            this.vehicleService
                .createVehicle(vehicleCreateRequest)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe(
                    () => {
                        this.router.navigate(['/vehicles']);
                    },
                    () => {
                        this.snackBarService.openSnackBar(INVALID_FORM_MESSAGE);
                    }
                );
        } else {
            this.snackBarService.openSnackBar(INVALID_FORM_MESSAGE);
        }
    }

    getDriverText(): string {
        return '';
    }
}

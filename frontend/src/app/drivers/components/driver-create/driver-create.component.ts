import { Component, DestroyRef } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SnackbarService } from '../../../../utilities/services/snackbar.service';
import { dateOfBirthValidator } from '../../_helpers';
import {
    MatError,
    MatFormField,
    MatHint,
    MatLabel,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { NgIf } from '@angular/common';
import {
    MatDatepicker,
    MatDatepickerInput,
} from '@angular/material/datepicker';
import { MatButton } from '@angular/material/button';
import moment from 'moment';
import { DriverCreateRequest } from '../../types/drivers';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { INVALID_FORM_MESSAGE } from '../../../../utilities/_constants';
import { DriversService } from '../../service/drivers.service';

@Component({
    selector: 'app-driver-create',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatFormField,
        MatLabel,
        MatInput,
        MatError,
        NgIf,
        MatDatepickerInput,
        MatHint,
        MatDatepicker,
        MatButton,
        RouterLink,
    ],
    templateUrl: './driver-create.component.html',
    styleUrl: './driver-create.component.scss',
})
export class DriverCreateComponent {
    createDriverForm!: FormGroup;

    constructor(
        private router: Router,
        private snackBarService: SnackbarService,
        private destroyRef: DestroyRef,
        private driverService: DriversService
    ) {
        this.createDriverForm = new FormGroup({
            name: new FormControl('', Validators.required),
            surname: new FormControl('', Validators.required),
            email: new FormControl('', [Validators.required, Validators.email]),
            dateOfBirth: new FormControl('', [
                Validators.required,
                dateOfBirthValidator(),
            ]),
            driverLicenseCountryCode: new FormControl('', Validators.required),
            driverLicenseNumber: new FormControl('', Validators.required),
        });
    }

    onCreateDriver(): void {
        if (this.createDriverForm.valid) {
            const driverFormValue = this.createDriverForm.value;
            const driverCreateRequest: DriverCreateRequest = {
                name: driverFormValue.name,
                surname: driverFormValue.surname,
                email: driverFormValue.email,
                drivingLicenseCountryCode:
                    driverFormValue.driverLicenseCountryCode,
                drivingLicenseNumber: driverFormValue.driverLicenseNumber,
                birthDate: moment(driverFormValue.birthDate).format(
                    'YYYY-MM-DD'
                ),
            };

            this.driverService
                .createDriver(driverCreateRequest)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe(
                    () => {
                        this.router.navigate(['/drivers']);
                    },
                    () => {
                        this.snackBarService.openSnackBar(INVALID_FORM_MESSAGE);
                    }
                );
        } else {
            this.snackBarService.openSnackBar(INVALID_FORM_MESSAGE);
        }
    }
}

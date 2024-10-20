import { Component } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { SignComponent } from '../sign/sign.component';
import { RouterLink } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { SnackbarService } from '../../../../utilities/services/snackbar.service';
import {
    PASSWORD_PATTERN,
    passwordMatchValidator,
    PHONE_NUMBER_PATTERN,
} from '../../_helpers';
import { INVALID_FORM_MESSAGE } from '../../../../utilities/_constants';
import { AuthService } from '../../service/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        MatLabel,
        MatFormField,
        ReactiveFormsModule,
        MatInput,
        MatButton,
        MatCheckbox,
        RouterLink,
        SignComponent,
        MatError,
        NgIf,
        NgClass,
    ],
    templateUrl: './register.component.html',
    styleUrl: '../sign/sign.component.scss',
})
export class RegisterComponent {
    registerForm: FormGroup;

    constructor(
        private authService: AuthService,
        public snackBarService: SnackbarService
    ) {
        this.registerForm = new FormGroup(
            {
                name: new FormControl('', Validators.required),
                surname: new FormControl('', Validators.required),
                email: new FormControl('', [
                    Validators.required,
                    Validators.email,
                ]),
                phone: new FormControl(
                    '',
                    Validators.pattern(PHONE_NUMBER_PATTERN)
                ),
                password: new FormControl('', [
                    Validators.required,
                    Validators.pattern(PASSWORD_PATTERN),
                ]),
                repeatPassword: new FormControl('', [Validators.required]),
            },
            { validators: passwordMatchValidator }
        );
    }

    onSubmit(): void {
        if (this.registerForm.valid) {
            const formValues = this.registerForm.value;
            this.authService.register({
                name: formValues.name,
                surname: formValues.surname,
                email: formValues.email,
                password: formValues.password,
                number: formValues.phone || null,
            });
            this.registerForm.reset();
        } else {
            this.snackBarService.openSnackBar(INVALID_FORM_MESSAGE);
        }
    }

    onGoogleLogin(): void {
        this.authService.loginViaGoogle();
    }
}

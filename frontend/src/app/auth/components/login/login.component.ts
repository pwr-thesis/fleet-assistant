import { Component } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SignComponent } from '../sign/sign.component';
import { SnackbarService } from '../../../../utilities/services/snackbar.service';
import { INVALID_FORM_MESSAGE } from '../../../../utilities/_constants';
import { AuthService } from '../../service/auth.service';

@Component({
    selector: 'app-login',
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
    ],
    templateUrl: './login.component.html',
    styleUrl: '../sign/sign.component.scss',
})
export class LoginComponent {
    loginForm: FormGroup;

    constructor(
        private authService: AuthService,
        public snackbarService: SnackbarService
    ) {
        this.loginForm = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.required]),
            rememberMe: new FormControl(false),
        });
    }

    onSubmit(): void {
        if (this.loginForm.valid) {
            const formValues = this.loginForm.value;
            this.authService.login({
                email: formValues.email,
                password: formValues.password,
            });
        } else {
            this.snackbarService.openSnackBar(INVALID_FORM_MESSAGE);
        }
    }

    onGoogleLogin(): void {
        this.authService.loginViaGoogle();
    }
}

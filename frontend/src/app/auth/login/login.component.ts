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
import {  } from '../sign/sign.component';
import { SnackbarService } from '../../../utilities/services/snackbar.service';
import { INVALID_FORM_MESSAGE } from '../../../utilities/_constants';

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

    constructor(public snackbarService: SnackbarService) {
        this.loginForm = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.required]),
            rememberMe: new FormControl(false),
        });
    }

    onSubmit(): void {
        if (this.loginForm.valid) {
            const formValues = this.loginForm.value;
            alert(
                'Form Submitted' +
                    formValues.email +
                    ' ' +
                    formValues.password +
                    ' ' +
                    formValues.rememberMe
            );
            this.loginForm.reset();
        } else {
            this.snackbarService.openSnackBar(INVALID_FORM_MESSAGE);
        }
    }
}

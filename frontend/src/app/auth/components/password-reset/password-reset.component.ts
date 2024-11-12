import { Component } from '@angular/core';
import { SignComponent } from '../sign/sign.component';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { SnackbarService } from '../../../../utilities/services/snackbar.service';
import { INVALID_FORM_MESSAGE } from '../../../../utilities/_constants';

@Component({
    selector: 'app-password-reset',
    standalone: true,
    imports: [
        MatLabel,
        MatFormField,
        ReactiveFormsModule,
        MatInput,
        MatButton,
        RouterLink,
        SignComponent,
    ],
    templateUrl: './password-reset.component.html',
    styleUrl: '../sign/sign.component.scss',
})
export class PasswordResetComponent {
    passwordResetForm: FormGroup;

    constructor(public snackbarService: SnackbarService) {
        this.passwordResetForm = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email]),
        });
    }

    onSubmit(): void {
        if (this.passwordResetForm.valid) {
            const formValues = this.passwordResetForm.value;
            alert('Form Submitted' + formValues.email);
            this.passwordResetForm.reset();
        } else {
            this.snackbarService.openSnackBar(INVALID_FORM_MESSAGE);
        }
    }
}

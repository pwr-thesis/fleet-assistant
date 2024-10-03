import { Component, ViewEncapsulation } from '@angular/core';
import {
    MatError,
    MatFormField,
    MatHint,
    MatLabel,
} from '@angular/material/form-field';
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatButtonToggle } from '@angular/material/button-toggle';
import { MatButton } from '@angular/material/button';
import { SnackbarService } from '../../../utilities/services/snackbar.service';
import { INVALID_FORM_MESSAGE } from '../../../utilities/_constants';

@Component({
    selector: 'app-contact-form',
    standalone: true,
    imports: [
        MatError,
        MatHint,
        MatLabel,
        MatFormField,
        ReactiveFormsModule,
        MatInput,
        MatButtonToggle,
        FormsModule,
        MatButton,
    ],
    templateUrl: './contact-form.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class ContactFormComponent {
    contactForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        message: new FormControl(''),
    });

    constructor(public snackBarService: SnackbarService) {}

    onFormSubmit(): void {
        if (this.contactForm.valid) {
            alert(
                'Form Submitted' +
                    this.contactForm.value.email +
                    ' ' +
                    this.contactForm.value.message
            );
            this.contactForm.reset();
        } else {
            this.snackBarService.openSnackBar(INVALID_FORM_MESSAGE, 'end');
        }
    }
}

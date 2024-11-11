import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactFormComponent } from './contact-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../auth/service/auth.service';
import { SnackbarService } from '../../../../utilities/services/snackbar.service';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

describe('ContactFormComponent', () => {
    let component: ContactFormComponent;
    let fixture: ComponentFixture<ContactFormComponent>;
    let authServiceMock: jasmine.SpyObj<AuthService>;
    let snackBarServiceMock: jasmine.SpyObj<SnackbarService>;

    beforeEach(() => {
        authServiceMock = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
        snackBarServiceMock = jasmine.createSpyObj('SnackbarService', [
            'openSnackBar',
        ]);

        TestBed.configureTestingModule({
            declarations: [],
            imports: [
                ReactiveFormsModule,
                ContactFormComponent,
                MatFormField,
                MatInput,
                MatError,
                MatButton,
                BrowserAnimationsModule,
            ],
            providers: [
                { provide: AuthService, useValue: authServiceMock },
                { provide: SnackbarService, useValue: snackBarServiceMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ContactFormComponent);
        component = fixture.componentInstance;
    });

    it('should display email error when the email is invalid', () => {
        component.contactForm.controls['email'].setValue('invalid-email');
        component.contactForm.controls['email'].markAsTouched();
        fixture.detectChanges();

        const errorMessage = fixture.debugElement.query(By.css('mat-error'));
        expect(errorMessage.nativeElement.textContent).toContain(
            'Please enter a valid email address'
        );
    });

    it('should display required error when email is not entered', () => {
        component.contactForm.controls['email'].setValue('');
        component.contactForm.controls['email'].markAsTouched();
        fixture.detectChanges();

        const errorMessage = fixture.debugElement.query(By.css('mat-error'));
        expect(errorMessage.nativeElement.textContent).toContain(
            'Email is required'
        );
    });

    it('should display the email field when not logged in', () => {
        authServiceMock.isLoggedIn.and.returnValue(false);
        fixture.detectChanges();

        const emailField = fixture.debugElement.query(By.css('mat-form-field'));
        expect(emailField).toBeTruthy();
    });
});

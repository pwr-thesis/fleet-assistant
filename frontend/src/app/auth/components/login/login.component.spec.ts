import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { SnackbarService } from '../../../../utilities/services/snackbar.service';
import { LoginComponent } from './login.component';
import { By } from '@angular/platform-browser';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterTestingModule } from '@angular/router/testing';
import { INVALID_FORM_MESSAGE } from '../../../../utilities/_constants';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let authService: jasmine.SpyObj<AuthService>;
    let snackbarService: jasmine.SpyObj<SnackbarService>;

    beforeEach(async () => {
        const authServiceSpy = jasmine.createSpyObj('AuthService', [
            'login',
            'loginViaGoogle',
        ]);
        const snackbarServiceSpy = jasmine.createSpyObj('SnackbarService', [
            'openSnackBar',
        ]);

        await TestBed.configureTestingModule({
            imports: [
                LoginComponent,
                ReactiveFormsModule,
                MatFormFieldModule,
                MatInputModule,
                MatCheckboxModule,
                MatButtonModule,
                RouterTestingModule,
                BrowserAnimationsModule,
            ],
            declarations: [],
            providers: [
                { provide: AuthService, useValue: authServiceSpy },
                { provide: SnackbarService, useValue: snackbarServiceSpy },
            ],
        }).compileComponents();

        authService = TestBed.inject(
            AuthService
        ) as jasmine.SpyObj<AuthService>;
        snackbarService = TestBed.inject(
            SnackbarService
        ) as jasmine.SpyObj<SnackbarService>;

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize loginForm with email, password, and rememberMe controls', () => {
        expect(component.loginForm.contains('email')).toBeTruthy();
        expect(component.loginForm.contains('password')).toBeTruthy();
        expect(component.loginForm.contains('rememberMe')).toBeTruthy();
    });

    it('should make email and password controls required', () => {
        const emailControl = component.loginForm.get('email');
        const passwordControl = component.loginForm.get('password');

        emailControl?.setValue('');
        passwordControl?.setValue('');

        expect(emailControl?.valid).toBeFalsy();
        expect(passwordControl?.valid).toBeFalsy();
        expect(emailControl?.hasError('required')).toBeTruthy();
        expect(passwordControl?.hasError('required')).toBeTruthy();
    });

    it('should call authService.login with form values when form is valid', () => {
        const formValues = {
            email: 'test@example.com',
            password: 'password123',
            rememberMe: true,
        };
        component.loginForm.setValue(formValues);

        component.onSubmit();

        expect(authService.login).toHaveBeenCalledWith({
            email: formValues.email,
            password: formValues.password,
        });
        expect(snackbarService.openSnackBar).not.toHaveBeenCalled();
    });

    it('should not call authService.login and show snackbar when form is invalid', () => {
        component.loginForm.setValue({
            email: '',
            password: '',
            rememberMe: false,
        });

        component.onSubmit();

        expect(authService.login).not.toHaveBeenCalled();
        expect(snackbarService.openSnackBar).toHaveBeenCalledWith(
            INVALID_FORM_MESSAGE
        );
    });

    it('should call authService.loginViaGoogle when onGoogleLogin is called', () => {
        component.onGoogleLogin();
        expect(authService.loginViaGoogle).toHaveBeenCalled();
    });

    it('should enable the submit button if the form is valid', () => {
        component.loginForm.setValue({
            email: 'test@example.com',
            password: 'password123',
            rememberMe: false,
        });
        fixture.detectChanges();

        const submitButton = fixture.debugElement.query(
            By.css('button[type="submit"]')
        ).nativeElement;
        expect(submitButton.disabled).toBeFalsy();
    });
});

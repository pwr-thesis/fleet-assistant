import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {MatError, MatFormFieldModule} from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterTestingModule } from '@angular/router/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../service/auth.service';
import { SnackbarService } from '../../../../utilities/services/snackbar.service';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('RegisterComponent', () => {
    let component: RegisterComponent;
    let fixture: ComponentFixture<RegisterComponent>;
    let authService: jasmine.SpyObj<AuthService>;
    let snackBarService: jasmine.SpyObj<SnackbarService>;

    beforeEach(async () => {
        authService = jasmine.createSpyObj('AuthService', ['register', 'loginViaGoogle']);
        snackBarService = jasmine.createSpyObj('SnackbarService', ['openSnackBar']);

        await TestBed.configureTestingModule({
            declarations: [],
            imports: [
                RegisterComponent,
                ReactiveFormsModule,
                MatButtonModule,
                MatInputModule,
                MatFormFieldModule,
                MatError,
                MatCheckboxModule,
                RouterTestingModule,
                BrowserAnimationsModule
            ],
            providers: [
                { provide: AuthService, useValue: authService },
                { provide: SnackbarService, useValue: snackBarService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RegisterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the register component', () => {
        expect(component).toBeTruthy();
    });

    it('should call register method of AuthService when form is valid and submitted', () => {
        component.registerForm.controls['name'].setValue('John');
        component.registerForm.controls['surname'].setValue('Doe');
        component.registerForm.controls['email'].setValue('test@example.com');
        component.registerForm.controls['password'].setValue('Password1!');
        component.registerForm.controls['repeatPassword'].setValue('Password1!');
        component.registerForm.controls['phone'].setValue('1234567890');

        component.onSubmit();

        expect(authService.register).toHaveBeenCalledWith({
            name: 'John',
            surname: 'Doe',
            email: 'test@example.com',
            password: 'Password1!',
            number: '1234567890',
        });
        expect(snackBarService.openSnackBar).not.toHaveBeenCalled();
    });

    it('should show an error message if the form is invalid and submitted', () => {
        component.registerForm.controls['name'].setValue('');
        component.registerForm.controls['surname'].setValue('');
        component.registerForm.controls['email'].setValue('invalid-email');
        component.registerForm.controls['password'].setValue('');
        component.registerForm.controls['repeatPassword'].setValue('');

        component.onSubmit();

        expect(snackBarService.openSnackBar).toHaveBeenCalledWith('Please fill in the form correctly');
        expect(authService.register).not.toHaveBeenCalled();
    });
});

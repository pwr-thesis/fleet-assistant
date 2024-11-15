import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DriverCreateComponent } from './driver-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { RouterTestingModule } from '@angular/router/testing';
import { DriversService } from '../../service/drivers.service';
import { SnackbarService } from '../../../../utilities/services/snackbar.service';
import { of, throwError } from 'rxjs';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('DriverCreateComponent', () => {
    let component: DriverCreateComponent;
    let fixture: ComponentFixture<DriverCreateComponent>;
    let driversServiceMock: jasmine.SpyObj<DriversService>;
    let snackbarServiceMock: jasmine.SpyObj<SnackbarService>;

    beforeEach(async () => {
        driversServiceMock = jasmine.createSpyObj('DriversService', [
            'createDriver',
        ]);
        snackbarServiceMock = jasmine.createSpyObj('SnackbarService', [
            'openSnackBar',
        ]);

        await TestBed.configureTestingModule({
            imports: [
                DriverCreateComponent,
                ReactiveFormsModule,
                MatSnackBarModule,
                MatFormFieldModule,
                MatInputModule,
                MatDatepickerModule,
                MatButtonModule,
                RouterTestingModule,
                MatNativeDateModule,
                BrowserAnimationsModule,
            ],
            providers: [
                { provide: DriversService, useValue: driversServiceMock },
                { provide: SnackbarService, useValue: snackbarServiceMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DriverCreateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize the form with empty fields', () => {
        expect(component.createDriverForm.value).toEqual({
            name: '',
            surname: '',
            email: '',
            dateOfBirth: '',
            driverLicenseCountryCode: '',
            driverLicenseNumber: '',
        });
    });

    it('should display an error message when the form is invalid', () => {
        component.onCreateDriver();
        expect(snackbarServiceMock.openSnackBar).toHaveBeenCalledWith(
            'Please fill in the form correctly'
        );
    });

    it('should navigate to "/drivers" on successful driver creation', () => {
        const routerSpy = spyOn(component['router'], 'navigate');
        const mockDriver = {
            name: 'John',
            surname: 'Doe',
            email: 'john.doe@example.com',
            dateOfBirth: '2000-01-01',
            driverLicenseCountryCode: 'US',
            driverLicenseNumber: 'DL12345',
        };

        component.createDriverForm.setValue(mockDriver);
        driversServiceMock.createDriver.and.returnValue(of('Success'));

        component.onCreateDriver();
        expect(routerSpy).toHaveBeenCalledWith(['/drivers']);
    });

    it('should show a snackbar error on driver creation failure', () => {
        const mockDriver = {
            name: 'John',
            surname: 'Doe',
            email: 'john.doe@example.com',
            dateOfBirth: '2000-01-01',
            driverLicenseCountryCode: 'US',
            driverLicenseNumber: 'DL12345',
        };

        component.createDriverForm.setValue(mockDriver);
        driversServiceMock.createDriver.and.returnValue(
            throwError(() => new Error('Error'))
        );

        component.onCreateDriver();
        expect(snackbarServiceMock.openSnackBar).toHaveBeenCalledWith(
            'Please fill in the form correctly'
        );
    });
});

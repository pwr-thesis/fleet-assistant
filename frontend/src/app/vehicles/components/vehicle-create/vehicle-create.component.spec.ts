import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleCreateComponent } from './vehicle-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { DriversService } from '../../../drivers/service/drivers.service';
import { VehiclesService } from '../../service/vehicles.service';
import { SnackbarService } from '../../../../utilities/services/snackbar.service';
import { CUSTOM_DATEFORMAT } from '../../_helpers';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('VehicleCreateComponent', () => {
    let component: VehicleCreateComponent;
    let fixture: ComponentFixture<VehicleCreateComponent>;
    let mockDriversService: jasmine.SpyObj<DriversService>;
    let mockVehiclesService: jasmine.SpyObj<VehiclesService>;
    let mockSnackbarService: jasmine.SpyObj<SnackbarService>;

    beforeEach(async () => {
        mockDriversService = jasmine.createSpyObj('DriversService', [
            'getRegisteredDrivers',
        ]);
        mockVehiclesService = jasmine.createSpyObj('VehiclesService', [
            'createVehicle',
        ]);
        mockSnackbarService = jasmine.createSpyObj('SnackbarService', [
            'openSnackBar',
        ]);

        mockDriversService.getRegisteredDrivers.and.returnValue(
            of([
                {
                    id: '1',
                    name: 'John',
                    surname: 'Doe',
                    email: 'john.doe@example.com',
                    drivingLicenseNumber: 'D12345',
                    driverLicenseCountryCode: 'US',
                    birthDate: ['1985', '01', '01'],
                    isEnabled: true,
                    role: 'driver',
                },
                {
                    id: '2',
                    name: 'Jane',
                    surname: 'Smith',
                    email: 'jane.smith@example.com',
                    drivingLicenseNumber: 'D67890',
                    driverLicenseCountryCode: 'CA',
                    birthDate: ['1990', '06', '15'],
                    isEnabled: true,
                    role: 'driver',
                },
            ])
        );

        await TestBed.configureTestingModule({
            imports: [
                ReactiveFormsModule,
                MatAutocompleteModule,
                MatInputModule,
                MatDatepickerModule,
                MatFormFieldModule,
                MatButtonModule,
                MatSnackBarModule,
                RouterTestingModule,
                VehicleCreateComponent,
                BrowserAnimationsModule,
            ],
            declarations: [],
            providers: [
                { provide: DriversService, useValue: mockDriversService },
                { provide: VehiclesService, useValue: mockVehiclesService },
                { provide: SnackbarService, useValue: mockSnackbarService },
                {
                    provide: CUSTOM_DATEFORMAT,
                    useValue: CUSTOM_DATEFORMAT,
                },
                {
                    provide: DateAdapter,
                    useClass: MomentDateAdapter,
                    deps: [MAT_DATE_LOCALE],
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(VehicleCreateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize the form with required controls', () => {
        expect(component.createVehicleForm.contains('name')).toBe(true);
        expect(component.createVehicleForm.contains('vin')).toBe(true);
        expect(component.createVehicleForm.contains('plateNumber')).toBe(true);
        expect(component.createVehicleForm.contains('countryCode')).toBe(true);
        expect(component.createVehicleForm.contains('productionDate')).toBe(
            true
        );
        expect(component.createVehicleForm.contains('insuranceDate')).toBe(
            true
        );
        expect(
            component.createVehicleForm.contains('lastVehicleInspectionDate')
        ).toBe(true);
        expect(component.createVehicleForm.contains('driver')).toBe(true);
    });

    it('should validate required fields', () => {
        const nameControl = component.createVehicleForm.get('name');
        nameControl?.setValue('');
        expect(nameControl?.valid).toBe(false);

        const vinControl = component.createVehicleForm.get('vin');
        vinControl?.setValue('');
        expect(vinControl?.valid).toBe(false);

        const productionDateControl =
            component.createVehicleForm.get('productionDate');
        productionDateControl?.setValue('');
        expect(productionDateControl?.valid).toBe(false);
    });

    it('should filter drivers based on input', () => {
        component.driverInput.nativeElement.value = 'John';
        component.filter();
        expect(component.filteredDrivers.length).toBe(1);
        expect(component.filteredDrivers[0].name).toBe('John');
    });

    it('should show an error message when form is invalid', () => {
        component.createVehicleForm.patchValue({ name: '' });
        component.onCreateVehicle();
        expect(mockSnackbarService.openSnackBar).toHaveBeenCalledWith(
            'Please fill in the form correctly'
        );
    });
});

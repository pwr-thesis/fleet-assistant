import { TestBed, ComponentFixture } from '@angular/core/testing';
import { VehiclesAllComponent } from './vehicles-all.component';
import { VehiclesService } from '../../service/vehicles.service';
import { AuthService } from '../../../auth/service/auth.service';
import { DriversService } from '../../../drivers/service/drivers.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

describe('VehiclesAllComponent', () => {
    let component: VehiclesAllComponent;
    let fixture: ComponentFixture<VehiclesAllComponent>;
    let mockVehiclesService: jasmine.SpyObj<VehiclesService>;
    let mockAuthService: jasmine.SpyObj<AuthService>;
    let mockDriversService: jasmine.SpyObj<DriversService>;

    beforeEach(async () => {
        mockVehiclesService = jasmine.createSpyObj('VehiclesService', [
            'getAllVehicles',
        ]);
        mockAuthService = jasmine.createSpyObj('AuthService', ['isManager']);
        mockDriversService = jasmine.createSpyObj('DriversService', [
            'getRegisteredDrivers',
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
                VehiclesAllComponent,
                RouterTestingModule,
                BrowserAnimationsModule,
                ReactiveFormsModule,
            ],
            providers: [
                { provide: VehiclesService, useValue: mockVehiclesService },
                { provide: AuthService, useValue: mockAuthService },
                { provide: DriversService, useValue: mockDriversService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(VehiclesAllComponent);
        component = fixture.componentInstance;

        mockVehiclesService.getAllVehicles.and.returnValue(
            of({
                content: [
                    {
                        id: 1,
                        name: 'Vehicle 1',
                        vin: 'VIN12345678901234',
                        plateNumber: 'ABC123',
                        countryCode: 'US',
                        insuranceDate: ['2023', '11', '10'],
                        lastInspectionDate: ['2023', '10', '01'],
                        nextInspectionDate: ['2024', '11', '01'],
                        productionDate: ['2022', '01', '01'],
                        driver: undefined,
                        locations: [],
                    },
                ],
                totalElements: 1,
            })
        );

        mockAuthService.isManager.and.returnValue(true);
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should render vehicles when available', () => {
        fixture.detectChanges();
        const vehicleCards = fixture.debugElement.queryAll(
            By.css('app-vehicle-card')
        );
        expect(vehicleCards.length).toBe(1);
    });

    it('should display driver text correctly', () => {
        const driver = {
            id: '1',
            name: 'John',
            surname: 'Doe',
            email: 'john.doe@example.com',
            drivingLicenseNumber: 'D12345',
            driverLicenseCountryCode: 'US',
            birthDate: ['1985', '01', '01'],
            isEnabled: true,
            role: 'driver',
        };
        expect(component.getDriverText(driver)).toBe(
            'John Doe, john.doe@example.com'
        );
        expect(component.getDriverText('Not assigned')).toBe('Not assigned');
    });

    it('should call the correct search params', () => {
        component.vehicleSearchForm.setValue({
            name: 'Vehicle 1',
            countryCode: 'US',
            driver: 'Not assigned',
        });
        component.onSearch();
        expect(mockVehiclesService.getAllVehicles).toHaveBeenCalledWith(
            { pageNumber: 0, pageSize: 4 },
            {
                name: 'Vehicle 1',
                countryCode: 'US',
                driverId: null,
                isDriverAssigned: false,
            }
        );
    });
});

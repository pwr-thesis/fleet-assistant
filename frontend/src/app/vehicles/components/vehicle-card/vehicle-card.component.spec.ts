import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleCardComponent } from './vehicle-card.component';
import { CardFieldComponent } from '../../../common/components/card-field/card-field.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Vehicle } from '../../types/vehicles';
import { By } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { DebugElement } from '@angular/core';

describe('VehicleCardComponent', () => {
    let component: VehicleCardComponent;
    let fixture: ComponentFixture<VehicleCardComponent>;
    let debugElement: DebugElement;

    const mockVehicle: Vehicle = {
        id: 1,
        name: 'Test Vehicle',
        vin: '12345VIN',
        plateNumber: 'ABC123',
        countryCode: 'US',
        insuranceDate: ['2024', '01', '01'],
        lastInspectionDate: ['2023', '12', '01'],
        nextInspectionDate: ['2024', '06', '01'],
        productionDate: ['2020', '05', '01'],
        driver: {
            id: '123',
            name: 'John',
            surname: 'Doe',
            email: 'john.doe@example.com',
            role: 'driver',
            drivingLicenseNumber: 'D12345',
            drivingLicenseCountryCode: 'US',
            birthDate: ['1985', '01', '01'],
            isEnabled: true,
        },
        locations: [],
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                MatCardModule,
                VehicleCardComponent,
                CardFieldComponent,
            ],
            declarations: [],
        }).compileComponents();

        fixture = TestBed.createComponent(VehicleCardComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('when isDriver is false', () => {
        beforeEach(() => {
            component.vehicle = mockVehicle;
            component.isDriver = false;
            fixture.detectChanges();
        });

        it('should display vehicle name as title', () => {
            const title = debugElement.query(
                By.css('mat-card-title')
            ).nativeElement;
            expect(title.textContent.trim()).toBe('Test Vehicle');
        });

        it('should add "text-red-700" class to driver field if driver is not assigned', () => {
            component.vehicle.driver = undefined;
            fixture.detectChanges();

            const driverField = debugElement.query(
                By.css('app-card-field')
            ).nativeElement;
            expect(driverField.classList).toContain('text-red-700');
        });

        it('should render the Plate Number field', () => {
            const plateField = debugElement.queryAll(
                By.css('app-card-field')
            )[1].nativeElement;
            expect(plateField.textContent).toContain('Plate Number');
            expect(plateField.textContent).toContain('ABC123');
        });

        it('should generate a router link to vehicle details page', () => {
            const card = debugElement.query(By.css('mat-card')).nativeElement;
            expect(card.getAttribute('ng-reflect-router-link')).toBe(
                '/vehicles/details/1'
            );
        });
    });

    describe('when isDriver is true', () => {
        beforeEach(() => {
            component.vehicle = mockVehicle;
            component.isDriver = true;
            fixture.detectChanges();
        });

        it('should render the VIN field', () => {
            const vinField = debugElement.queryAll(By.css('app-card-field'))[0]
                .nativeElement;
            expect(vinField.textContent).toContain('VIN');
            expect(vinField.textContent).toContain('12345VIN');
        });

        it('should not render driver information in the subtitle', () => {
            const subtitle = debugElement.query(By.css('mat-card-subtitle'));
            expect(subtitle).toBeFalsy();
        });

        it('should not generate a router link', () => {
            const card = debugElement.query(By.css('mat-card')).nativeElement;
            expect(card.getAttribute('ng-reflect-router-link')).toBeNull();
        });
    });
});

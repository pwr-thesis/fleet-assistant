import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DriverCardComponent } from './driver-card.component';
import { By } from '@angular/platform-browser';

describe('DriverCardComponent', () => {
    let component: DriverCardComponent;
    let fixture: ComponentFixture<DriverCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DriverCardComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DriverCardComponent);
        component = fixture.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should display driver name and surname', () => {
        component.driver = {
            id: '1',
            role: 'DRIVER',
            name: 'John',
            surname: 'Doe',
            email: 'john.doe@example.com',
            isEnabled: true,
            drivingLicenseNumber: 'DL12345',
            driverLicenseCountryCode: 'US',
            birthDate: ['1990', '1', '1'],
        };
        fixture.detectChanges();

        const titleElement = fixture.debugElement.query(
            By.css('mat-card-title span')
        ).nativeElement;
        expect(titleElement.textContent).toContain('John Doe');
    });

    it('should display driver email', () => {
        component.driver = {
            id: '1',
            role: 'DRIVER',
            name: 'John',
            surname: 'Doe',
            email: 'john.doe@example.com',
            isEnabled: true,
            drivingLicenseNumber: 'DL12345',
            driverLicenseCountryCode: 'US',
            birthDate: ['1990', '1', '1'],
        };
        fixture.detectChanges();

        const emailField = fixture.debugElement.query(
            By.css('app-card-field[fieldName="E-mail"]')
        );
        expect(emailField.attributes['ng-reflect-field-value']).toBe(
            'john.doe@example.com'
        );
    });

    it('should show "In registration process" if driver is not enabled', () => {
        component.driver = {
            id: '1',
            role: 'DRIVER',
            name: 'John',
            surname: 'Doe',
            email: 'john.doe@example.com',
            isEnabled: false,
            drivingLicenseNumber: 'DL12345',
            driverLicenseCountryCode: 'US',
            birthDate: ['1990', '1', '1'],
        };
        fixture.detectChanges();

        const registrationSpan = fixture.debugElement.query(
            By.css('.text-red-700')
        );
        expect(registrationSpan.nativeElement.textContent).toContain(
            'In registration process'
        );
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DriversAllComponent } from './drivers-all.component';
import { DriversService } from '../../service/drivers.service';
import { of } from 'rxjs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DriverCardComponent } from '../driver-card/driver-card.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('DriversAllComponent', () => {
    let component: DriversAllComponent;
    let fixture: ComponentFixture<DriversAllComponent>;
    let driversServiceMock: jasmine.SpyObj<DriversService>;

    beforeEach(async () => {
        driversServiceMock = jasmine.createSpyObj('DriversService', [
            'getAllDrivers',
        ]);

        await TestBed.configureTestingModule({
            imports: [
                DriversAllComponent,
                MatPaginatorModule,
                RouterTestingModule.withRoutes([]),
                BrowserAnimationsModule,
            ],
            providers: [
                { provide: DriversService, useValue: driversServiceMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DriversAllComponent);
        component = fixture.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should display a list of drivers when drivers exist', () => {
        const mockDrivers = [
            {
                id: '1',
                name: 'John',
                surname: 'Doe',
                email: 'john.doe@example.com',
                drivingLicenseNumber: '12345',
                driverLicenseCountryCode: 'US',
                birthDate: ['1990', '01', '01'],
                isEnabled: true,
                role: 'DRIVER',
            },
            {
                id: '2',
                name: 'Jane',
                surname: 'Smith',
                email: 'jane.smith@example.com',
                drivingLicenseNumber: '12345',
                driverLicenseCountryCode: 'US',
                birthDate: ['1990', '01', '01'],
                isEnabled: true,
                role: 'DRIVER',
            },
        ];
        driversServiceMock.getAllDrivers.and.returnValue(
            of({ content: mockDrivers, totalElements: 2 })
        );

        fixture.detectChanges();

        const driverCards = fixture.debugElement.queryAll(
            By.directive(DriverCardComponent)
        );
        expect(driverCards.length).toBe(2);
    });

    it('should update drivers when paginator page changes', () => {
        driversServiceMock.getAllDrivers.and.returnValues(
            of({
                content: [
                    {
                        id: '1',
                        name: 'John',
                        surname: 'Doe',
                        email: 'john.doe@example.com',
                        drivingLicenseNumber: '12345',
                        driverLicenseCountryCode: 'US',
                        birthDate: ['1990', '01', '01'],
                        isEnabled: true,
                        role: 'DRIVER',
                    },
                ],
                totalElements: 2,
            }),
            of({
                content: [
                    {
                        id: '2',
                        name: 'Jane',
                        surname: 'Smith',
                        email: 'jane.smith@example.com',
                        drivingLicenseNumber: '12345',
                        driverLicenseCountryCode: 'US',
                        birthDate: ['1990', '01', '01'],
                        isEnabled: true,
                        role: 'DRIVER',
                    },
                ],
                totalElements: 2,
            })
        );

        fixture.detectChanges();

        const paginator = fixture.debugElement.query(By.css('mat-paginator'));
        expect(paginator).toBeTruthy();

        const pageEvent = { pageIndex: 1, pageSize: 4, length: 2 };
        component.handlePageEvent(pageEvent);

        fixture.detectChanges();

        const driverCards = fixture.debugElement.queryAll(
            By.directive(DriverCardComponent)
        );
        expect(driverCards.length).toBe(1);
        expect(driverCards[0].componentInstance.driver.name).toBe('Jane');
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DriversAllComponent } from './drivers-all.component';
import { DriversService } from '../../service/drivers.service';
import { of } from 'rxjs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AddCardComponent } from '../../../common/components/add-card/add-card.component';
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
                drivingLicenseCountryCode: 'US',
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
                drivingLicenseCountryCode: 'US',
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

    it('should display a message and "add card" when no drivers exist', () => {
        driversServiceMock.getAllDrivers.and.returnValue(
            of({ content: [], totalElements: 0 })
        );

        fixture.detectChanges();

        const message = fixture.debugElement.query(By.css('h3')).nativeElement
            .textContent;
        expect(message).toContain("You don't have any driver in your fleet!");

        const addCard = fixture.debugElement.query(
            By.directive(AddCardComponent)
        );
        expect(addCard).toBeTruthy();
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
                        drivingLicenseCountryCode: 'US',
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
                        drivingLicenseCountryCode: 'US',
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

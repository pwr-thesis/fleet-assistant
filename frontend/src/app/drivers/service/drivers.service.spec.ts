import { TestBed } from '@angular/core/testing';
import { DriversService } from './drivers.service';
import { DriversHttpService } from './drivers-http.service';
import { of } from 'rxjs';
import { Driver, DriverCreateRequest, DriversPage } from '../types/drivers';
import { Pageable } from '../../vehicles/types/vehicles';

describe('DriversService', () => {
    let service: DriversService;
    let httpServiceMock: jasmine.SpyObj<DriversHttpService>;

    beforeEach(() => {
        const mockHttpService = jasmine.createSpyObj('DriversHttpService', [
            'getAllDrivers',
            'getRegisteredDrivers',
            'createDriver',
        ]);

        TestBed.configureTestingModule({
            providers: [
                DriversService,
                { provide: DriversHttpService, useValue: mockHttpService },
            ],
        });

        service = TestBed.inject(DriversService);
        httpServiceMock = TestBed.inject(
            DriversHttpService
        ) as jasmine.SpyObj<DriversHttpService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getAllDrivers', () => {
        it('should call getAllDrivers on DriversHttpService with correct parameters', () => {
            const pageable: Pageable = { pageNumber: 1, pageSize: 10 };
            const mockDriversPage: DriversPage = {
                content: [
                    {
                        id: '1',
                        name: 'John',
                        surname: 'Doe',
                        email: 'john.doe@example.com',
                        role: 'driver',
                        drivingLicenseNumber: '12345',
                        drivingLicenseCountryCode: 'US',
                        birthDate: ['1990-01-01'],
                        isEnabled: true,
                    },
                ],
                totalElements: 1,
            };

            httpServiceMock.getAllDrivers.and.returnValue(of(mockDriversPage));

            service.getAllDrivers(pageable).subscribe((driversPage) => {
                expect(driversPage).toEqual(mockDriversPage);
            });

            expect(httpServiceMock.getAllDrivers).toHaveBeenCalledWith(
                pageable
            );
        });
    });

    describe('getRegisteredDrivers', () => {
        it('should call getRegisteredDrivers on DriversHttpService and return drivers', () => {
            const mockDrivers: Driver[] = [
                {
                    id: '1',
                    name: 'John',
                    surname: 'Doe',
                    email: 'john.doe@example.com',
                    role: 'driver',
                    drivingLicenseNumber: '12345',
                    drivingLicenseCountryCode: 'US',
                    birthDate: ['1990-01-01'],
                    isEnabled: true,
                },
            ];

            httpServiceMock.getRegisteredDrivers.and.returnValue(
                of(mockDrivers)
            );

            service.getRegisteredDrivers().subscribe((drivers) => {
                expect(drivers).toEqual(mockDrivers);
            });

            expect(httpServiceMock.getRegisteredDrivers).toHaveBeenCalled();
        });
    });

    describe('createDriver', () => {
        it('should call createDriver on DriversHttpService with correct parameters', () => {
            const driverCreateRequest: DriverCreateRequest = {
                name: 'Jane',
                surname: 'Doe',
                email: 'jane.doe@example.com',
                drivingLicenseNumber: '54321',
                driverLicenseCountryCode: 'UK',
                birthDate: '1985-05-15',
            };
            const mockResponse = 'Driver created successfully';

            httpServiceMock.createDriver.and.returnValue(of(mockResponse));

            service.createDriver(driverCreateRequest).subscribe((response) => {
                expect(response).toBe(mockResponse);
            });

            expect(httpServiceMock.createDriver).toHaveBeenCalledWith(
                driverCreateRequest
            );
        });
    });
});

import { TestBed } from '@angular/core/testing';
import {
    HttpClientTestingModule,
    HttpTestingController,
} from '@angular/common/http/testing';
import { DriversHttpService } from './drivers-http.service';
import { Driver, DriverCreateRequest, DriversPage } from '../types/drivers';
import { Pageable } from '../../vehicles/types/vehicles';
import {
    DRIVERS_URL,
    GET_DRIVERS_URL,
    GET_REGISTERED_DRIVERS_URL,
} from '../../../utilities/_urls';

describe('DriversHttpService', () => {
    let service: DriversHttpService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [DriversHttpService],
        });

        service = TestBed.inject(DriversHttpService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getAllDrivers', () => {
        it('should call the correct URL and return a DriversPage', () => {
            const pageable: Pageable = { pageSize: 5, pageNumber: 2 };
            const mockResponse: DriversPage = {
                content: [
                    {
                        id: '1',
                        name: 'John',
                        surname: 'Doe',
                        email: 'john.doe@example.com',
                        role: 'driver',
                        drivingLicenseNumber: '12345',
                        driverLicenseCountryCode: 'US',
                        birthDate: ['1990-01-01'],
                        isEnabled: true,
                    },
                ],
                totalElements: 1,
            };

            service.getAllDrivers(pageable, {}).subscribe((response) => {
                expect(response).toEqual(mockResponse);
            });

            const req = httpMock.expectOne(GET_DRIVERS_URL(pageable));
            expect(req.request.method).toBe('POST');
            req.flush(mockResponse);
        });
    });

    describe('getRegisteredDrivers', () => {
        it('should call the correct URL and return an array of drivers', () => {
            const mockDrivers: Driver[] = [
                {
                    id: '1',
                    name: 'Jane',
                    surname: 'Doe',
                    email: 'jane.doe@example.com',
                    role: 'driver',
                    drivingLicenseNumber: '54321',
                    driverLicenseCountryCode: 'UK',
                    birthDate: ['1985-05-15'],
                    isEnabled: true,
                },
            ];

            service.getRegisteredDrivers().subscribe((response) => {
                expect(response).toEqual(mockDrivers);
            });

            const req = httpMock.expectOne(GET_REGISTERED_DRIVERS_URL);
            expect(req.request.method).toBe('GET');
            req.flush(mockDrivers);
        });
    });

    describe('createDriver', () => {
        it('should call the correct URL and return a success message', () => {
            const driverRequest: DriverCreateRequest = {
                name: 'Alice',
                surname: 'Smith',
                email: 'alice.smith@example.com',
                drivingLicenseNumber: '67890',
                driverLicenseCountryCode: 'CA',
                birthDate: '1992-09-21',
            };
            const mockResponse = 'Driver created successfully';

            service.createDriver(driverRequest).subscribe((response) => {
                expect(response).toBe(mockResponse);
            });

            const req = httpMock.expectOne(DRIVERS_URL);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(driverRequest);
            req.flush(mockResponse);
        });
    });
});

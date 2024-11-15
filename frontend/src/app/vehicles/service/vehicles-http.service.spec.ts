import { TestBed } from '@angular/core/testing';
import { VehiclesHttpService } from './vehicles-http.service';
import {
    HttpClientTestingModule,
    HttpTestingController,
} from '@angular/common/http/testing';
import {
    Pageable,
    Vehicle,
    VehicleCreateRequest,
    VehiclesPage,
} from '../types/vehicles';
import {
    ASSIGN_DRIVER,
    GET_ALL_VEHICLES_URL,
    GET_VEHICLE_BY_ID_URL,
    VEHICLES_URL,
} from '../../../utilities/_urls';

describe('VehiclesHttpService', () => {
    let service: VehiclesHttpService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [VehiclesHttpService],
        });

        service = TestBed.inject(VehiclesHttpService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getAllVehicles', () => {
        it('should call the correct URL and return a page of vehicles', (done) => {
            const pageable: Pageable = { pageNumber: 0, pageSize: 10 };
            const mockResponse: VehiclesPage = {
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
            };

            service.getAllVehicles(pageable).subscribe((response) => {
                expect(response).toEqual(mockResponse);
                done();
            });

            const req = httpTestingController.expectOne(
                GET_ALL_VEHICLES_URL(pageable)
            );
            expect(req.request.method).toBe('GET');
            req.flush(mockResponse);
        });
    });

    describe('createVehicle', () => {
        it('should call the correct URL and create a vehicle', (done) => {
            const vehicleRequest: VehicleCreateRequest = {
                name: 'New Vehicle',
                vin: 'VIN98765432109876',
                plateNumber: 'DEF456',
                countryCode: 'UK',
                insuranceDate: '2023-01-01',
                lastInspectionDate: '2023-01-15',
                productionDate: '2021-01-01',
            };

            const mockVehicle: Vehicle = {
                id: 2,
                name: 'New Vehicle',
                vin: 'VIN98765432109876',
                plateNumber: 'DEF456',
                countryCode: 'UK',
                insuranceDate: ['2023', '01', '01'],
                lastInspectionDate: ['2023', '01', '15'],
                nextInspectionDate: [],
                productionDate: ['2021', '01', '01'],
                driver: undefined,
                locations: [],
            };

            service.createVehicle(vehicleRequest).subscribe((response) => {
                expect(response).toEqual(mockVehicle);
                done();
            });

            const req = httpTestingController.expectOne(VEHICLES_URL);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(vehicleRequest);
            req.flush(mockVehicle);
        });
    });

    describe('getVehicle', () => {
        it('should call the correct URL and return a vehicle', (done) => {
            const vehicleId = '1';
            const mockVehicle: Vehicle = {
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
            };

            service.getVehicle(vehicleId).subscribe((response) => {
                expect(response).toEqual(mockVehicle);
                done();
            });

            const req = httpTestingController.expectOne(
                GET_VEHICLE_BY_ID_URL(vehicleId)
            );
            expect(req.request.method).toBe('GET');
            req.flush(mockVehicle);
        });
    });

    describe('assignDriver', () => {
        it('should call the correct URL and return the updated vehicle', (done) => {
            const vehicleId = '1';
            const driverId = '101';
            const mockVehicle: Vehicle = {
                id: 1,
                name: 'Vehicle 1',
                vin: 'VIN12345678901234',
                plateNumber: 'ABC123',
                countryCode: 'US',
                insuranceDate: ['2023', '11', '10'],
                lastInspectionDate: ['2023', '10', '01'],
                nextInspectionDate: ['2024', '11', '01'],
                productionDate: ['2022', '01', '01'],
                driver: {
                    id: '101',
                    name: 'John',
                    surname: 'Doe',
                    email: 'john.doe@example.com',
                    role: 'Driver',
                    drivingLicenseNumber: '123',
                    drivingLicenseCountryCode: 'US',
                    birthDate: ['1990', '01', '01'],
                    isEnabled: true,
                },
                locations: [],
            };

            service.assignDriver(vehicleId, driverId).subscribe((response) => {
                expect(response).toEqual(mockVehicle);
                done();
            });

            const req = httpTestingController.expectOne(
                ASSIGN_DRIVER(vehicleId, driverId)
            );
            expect(req.request.method).toBe('POST');
            req.flush(mockVehicle);
        });
    });
});

import { TestBed } from '@angular/core/testing';
import { VehiclesService } from './vehicles.service';
import { VehiclesHttpService } from './vehicles-http.service';
import {
    Pageable,
    Vehicle,
    VehicleCreateRequest,
    VehiclesPage,
} from '../types/vehicles';
import { of } from 'rxjs';
import { Location } from '../../locations/types/locations';

describe('VehiclesService', () => {
    let service: VehiclesService;
    let mockHttpService: jasmine.SpyObj<VehiclesHttpService>;

    beforeEach(() => {
        mockHttpService = jasmine.createSpyObj('VehiclesHttpService', [
            'getAllVehicles',
            'createVehicle',
            'getVehicle',
            'getVehicleLocation',
            'assignDriver',
        ]);

        TestBed.configureTestingModule({
            providers: [
                VehiclesService,
                { provide: VehiclesHttpService, useValue: mockHttpService },
            ],
        });

        service = TestBed.inject(VehiclesService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getAllVehicles', () => {
        it('should call VehiclesHttpService.getAllVehicles and return a page of vehicles', (done) => {
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

            mockHttpService.getAllVehicles.and.returnValue(of(mockResponse));

            service
                .getAllVehicles(pageable, {
                    name: undefined,
                    countryCode: undefined,
                    driverId: null,
                    isDriverAssigned: undefined,
                })
                .subscribe((response) => {
                    expect(response).toEqual(mockResponse);
                    expect(mockHttpService.getAllVehicles).toHaveBeenCalledWith(
                        pageable,
                        {
                            name: undefined,
                            countryCode: undefined,
                            driverId: null,
                            isDriverAssigned: undefined,
                        }
                    );
                    done();
                });
        });
    });

    describe('createVehicle', () => {
        it('should call VehiclesHttpService.createVehicle and return a vehicle', (done) => {
            const vehicleRequest: VehicleCreateRequest = {
                name: 'New Vehicle',
                vin: 'VIN98765432109876',
                plateNumber: 'DEF456',
                countryCode: 'UK',
                productionDate: '2021-05-15',
                insuranceDate: '2021-05-15',
                lastInspectionDate: '2021-05-15',
            };
            const mockVehicle: Vehicle = {
                id: 2,
                name: 'New Vehicle',
                vin: 'VIN98765432109876',
                plateNumber: 'DEF456',
                countryCode: 'UK',
                insuranceDate: [],
                lastInspectionDate: [],
                nextInspectionDate: [],
                productionDate: ['2021', '05', '15'],
                driver: undefined,
                locations: [],
            };

            mockHttpService.createVehicle.and.returnValue(of(mockVehicle));

            service.createVehicle(vehicleRequest).subscribe((response) => {
                expect(response).toEqual(mockVehicle);
                expect(mockHttpService.createVehicle).toHaveBeenCalledWith(
                    vehicleRequest
                );
                done();
            });
        });
    });

    describe('getVehicle', () => {
        it('should call VehiclesHttpService.getVehicle and return a vehicle', (done) => {
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

            mockHttpService.getVehicle.and.returnValue(of(mockVehicle));

            service.getVehicle(vehicleId).subscribe((response) => {
                expect(response).toEqual(mockVehicle);
                expect(mockHttpService.getVehicle).toHaveBeenCalledWith(
                    vehicleId
                );
                done();
            });
        });
    });

    describe('getVehicleLocation', () => {
        it('should call VehiclesHttpService.getVehicleLocation and return a location', (done) => {
            const vehicleId = 1;
            const mockLocation: Location = {
                id: 1,
                latitude: 51.5074,
                longitude: -0.1278,
            };

            mockHttpService.getVehicleLocation.and.returnValue(
                of(mockLocation)
            );

            service.getVehicleLocation(vehicleId).subscribe((response) => {
                expect(response).toEqual(mockLocation);
                expect(mockHttpService.getVehicleLocation).toHaveBeenCalledWith(
                    vehicleId
                );
                done();
            });
        });
    });

    describe('assignDriver', () => {
        it('should call VehiclesHttpService.assignDriver and return a vehicle', (done) => {
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
                    drivingLicenseNumber: '123',
                    driverLicenseCountryCode: 'US',
                    birthDate: ['1990', '01', '10'],
                    isEnabled: true,
                    role: 'DRIVER',
                },
                locations: [],
            };

            mockHttpService.assignDriver.and.returnValue(of(mockVehicle));

            service.assignDriver(vehicleId, driverId).subscribe((response) => {
                expect(response).toEqual(mockVehicle);
                expect(mockHttpService.assignDriver).toHaveBeenCalledWith(
                    vehicleId,
                    driverId
                );
                done();
            });
        });
    });
});

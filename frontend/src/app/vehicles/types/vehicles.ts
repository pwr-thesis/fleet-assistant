import { UserInfo } from '../../auth/types/auth';

export interface Vehicle {
    id: number;
    name: string;
    vin: string;
    plateNumber: string;
    countryCode: string;
    insuranceDate: string[];
    lastInspectionDate: string[];
    nextInspectionDate: string[];
    productionDate: string[];
    driver?: Driver;
    //locations: Location[];
}

export interface VehiclesPage {
    content: Vehicle[];
}

export interface Driver {
    id: number;
    drivingLicenseNumber: string;
    drivingLicenseCountryCode: string;
    dateOfBirth: string;
    user: UserInfo;
}

export interface VehicleCreateRequest {
    name: string;
    vin: string;
    plateNumber: string;
    countryCode: string;
    insuranceDate: string;
    lastInspectionDate: string;
    productionDate: string;
    driver?: Driver;
    //locations: Location[];
}

import { UserInfo } from '../../auth/types/auth';

export interface Driver extends UserInfo {
    id: string;
    drivingLicenseNumber: string;
    drivingLicenseCountryCode: string;
    birthDate: string[];
    isEnabled: boolean;
}

export interface DriverCreateRequest {
    name: string;
    surname: string;
    email: string;
    drivingLicenseNumber: string;
    driverLicenseCountryCode: string;
    birthDate: string;
}

export interface DriversPage {
    content: Driver[];
    totalElements: number;
}

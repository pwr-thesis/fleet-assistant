import { UserInfo } from '../../auth/types/auth';

//TODO: CHECK ENTITY FROM BACKEND
export interface Driver extends UserInfo {
    id: string;
    drivingLicenseNumber: string;
    drivingLicenseCountryCode: string;
    birthDate: string[];
    isInRegisterProcess: boolean;
}

export interface DriverCreateRequest {
    name: string;
    surname: string;
    email: string;
    drivingLicenseNumber: string;
    drivingLicenseCountryCode: string;
    birthDate: string;
}

export interface DriversPage {
    content: Driver[];
}

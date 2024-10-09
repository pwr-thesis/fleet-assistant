import { UserInfo } from '../../auth/types/auth';

export interface Vehicle {
    id: number;
    vin: string;
    plateNumber: string;
    countryCode: string;
    driver?: Driver;
    //locations: Location[];
}

export interface Driver {
    id: number;
    drivingLicenseNumber: string;
    drivingLicenseCountryCode: string;
    dateOfBirth: string;
    user: UserInfo;
}

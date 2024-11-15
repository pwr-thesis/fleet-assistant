import { Location } from '../../locations/types/locations';
import { Driver } from '../../drivers/types/drivers';

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
    locations: Location[] | [];
}

export interface VehiclesPage {
    content: Vehicle[];
    totalElements: number;
}

export interface Pageable {
    pageSize: number;
    pageNumber: number;
}

export interface VehicleCreateRequest {
    name: string;
    vin: string;
    plateNumber: string;
    countryCode: string;
    insuranceDate: string;
    lastInspectionDate: string;
    productionDate: string;
    driver?: { id: number };
}

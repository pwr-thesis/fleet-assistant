import { environment } from '../environments/environment';
import { Pageable } from '../app/vehicles/types/vehicles';

export const LOGIN_URL = environment.apiUrl + '/auth/authenticate';
export const REGISTER_URL = environment.apiUrl + '/auth/register';
export const USER_INFO_URL = environment.apiUrl + '/user/data';
export const VEHICLES_URL = environment.apiUrl + '/vehicle';
export const GET_ALL_VEHICLES_URL = (pageable: Pageable): string =>
    environment.apiUrl +
    `/vehicle?page=${pageable.pageNumber}&size=${pageable.pageSize}`;
export const GET_VEHICLE_BY_ID_URL = (id: string): string =>
    VEHICLES_URL + `/${id}`;
export const GET_VEHICLE_LIVE_LOCATION_BY_ID_URL = (id: string): string =>
    VEHICLES_URL + `/${id}/location-stream`;
export const DRIVERS_URL = environment.apiUrl + '/driver';
export const GET_DRIVERS_URL = (registered: boolean): string =>
    environment.apiUrl + `/driver?registered=${registered}`;

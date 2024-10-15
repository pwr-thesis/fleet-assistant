import { environment } from '../environments/environment';

//TODO CHECK API URLS
export const LOGIN_URL = environment.apiUrl + '/auth/authenticate';
export const REGISTER_URL = environment.apiUrl + '/auth/register';
export const USER_INFO_URL = environment.apiUrl + '/user/data';
export const VEHICLES_URL = environment.apiUrl + '/vehicles';

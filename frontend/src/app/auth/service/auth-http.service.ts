import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginForm, RegisterForm } from '../types/auth';
import { Observable } from 'rxjs';
import {
    LOGIN_URL,
    REGISTER_URL,
    USER_INFO_URL,
} from '../../../utilities/_urls';

@Injectable({
    providedIn: 'root',
})
export class AuthHttpService {
    constructor(private http: HttpClient) {}

    //TODO: Introduce DTO interface for API response (remove any)
    login(loginForm: LoginForm): Observable<any> {
        return this.http.post(LOGIN_URL, loginForm);
    }

    //TODO: Introduce DTO interface for API response (remove any)
    register(registerForm: RegisterForm): Observable<any> {
        return this.http.post(REGISTER_URL, registerForm);
    }

    //TODO: Introduce DTO interface for API response (remove any)
    getUserData(): Observable<any> {
        return this.http.get(USER_INFO_URL);
    }
}

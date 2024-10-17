import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthResponse, LoginForm, RegisterForm, UserInfo } from '../types/auth';
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

    login(loginForm: LoginForm): Observable<AuthResponse> {
        return this.http.post(LOGIN_URL, loginForm) as Observable<AuthResponse>;
    }

    register(registerForm: RegisterForm): Observable<AuthResponse> {
        return this.http.post(
            REGISTER_URL,
            registerForm
        ) as Observable<AuthResponse>;
    }

    getUserData(): Observable<UserInfo> {
        return this.http.get(USER_INFO_URL) as Observable<UserInfo>;
    }
}

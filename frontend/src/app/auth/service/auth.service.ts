import { Injectable } from '@angular/core';
import { AuthGoogleService } from './auth-google.service';
import { LoginForm, RegisterForm, UserInfo } from '../types/auth';
import { AuthHttpService } from './auth-http.service';
import { INVALID_FORM_MESSAGE } from '../../../utilities/_constants';
import { SnackbarService } from '../../../utilities/services/snackbar.service';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(
        private authGoogleService: AuthGoogleService,
        private httpAuthService: AuthHttpService,
        private snackbarService: SnackbarService,
        private router: Router
    ) {
        this.authGoogleService.accessToken$.subscribe((token) => {
            if (token !== undefined && token !== '') {
                if (!localStorage.getItem('accessToken')) {
                    localStorage.setItem(
                        'accessToken',
                        authGoogleService.getToken()
                    );
                    //TODO API Call to User-Info endpoint
                    //this.getUserData();
                    localStorage.setItem(
                        'userInfo',
                        JSON.stringify({
                            name: 'USER',
                            surname: 'SURNAME',
                            email: 'user@gmail.com',
                            role: 'Manager',
                        })
                    );
                } else if (!localStorage.getItem('userInfo')) {
                    //TODO API Call to User-Info endpoint
                    //this.getUserData();
                    localStorage.setItem(
                        'userInfo',
                        JSON.stringify({
                            name: 'USER',
                            surname: 'SURNAME',
                            email: 'user@gmail.com',
                            role: 'Manager',
                        })
                    );
                }
            }
        });
    }

    login(loginForm: LoginForm): void {
        this.httpAuthService.login(loginForm).subscribe(
            (response) => {
                //TODO: set userData and accessToken to localStorage
                //localStorage.setItem('useInfo', response.userInfo)
                //localStorage.setItem('accessToken', response.accessToken)
                console.log(response);
                this.router.navigate(['/']);
            },
            () => {
                this.snackbarService.openSnackBar(INVALID_FORM_MESSAGE);
            }
        );
    }

    register(registerForm: RegisterForm): void {
        this.httpAuthService.register(registerForm).subscribe(
            (response) => {
                //TODO: set userData and accessToken to localStorage
                //localStorage.setItem('useInfo', response.userInfo)
                //localStorage.setItem('accessToken', response.accessToken)
                console.log(response);
                this.router.navigate(['/']);
            },
            () => {
                this.snackbarService.openSnackBar(INVALID_FORM_MESSAGE);
            }
        );
    }

    getUserData(): void {
        this.httpAuthService.getUserData().subscribe((response) => {
            //TODO: set userData to localStorage
            //localStorage.setItem('userInfo', response);
            console.log(response);
        });
    }

    logout(): void {
        if (this.authGoogleService.isLoggedIn()) {
            this.authGoogleService.logout();
        }

        localStorage.removeItem('userInfo');
        localStorage.removeItem('accessToken');
    }

    loginViaGoogle(): void {
        this.authGoogleService.login();
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('accessToken');
    }

    getUserInfo(): UserInfo | null {
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) return null;
        return JSON.parse(userInfo);
    }
}

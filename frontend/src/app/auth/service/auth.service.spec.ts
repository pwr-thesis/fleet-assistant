import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { AuthGoogleService } from './auth-google.service';
import { AuthHttpService } from './auth-http.service';
import { SnackbarService } from '../../../utilities/services/snackbar.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginForm, RegisterForm, UserInfo } from '../types/auth';
import { INVALID_FORM_MESSAGE } from '../../../utilities/_constants';

describe('AuthService', () => {
    let service: AuthService;
    let authGoogleServiceSpy: jasmine.SpyObj<AuthGoogleService>;
    let httpAuthServiceSpy: jasmine.SpyObj<AuthHttpService>;
    let snackbarServiceSpy: jasmine.SpyObj<SnackbarService>;
    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach(() => {
        authGoogleServiceSpy = jasmine.createSpyObj('AuthGoogleService', [
            'login',
            'logout',
            'isLoggedIn',
            'getToken',
            'accessToken$',
        ]);
        httpAuthServiceSpy = jasmine.createSpyObj('AuthHttpService', [
            'login',
            'register',
            'getUserData',
        ]);
        snackbarServiceSpy = jasmine.createSpyObj('SnackbarService', [
            'openSnackBar',
        ]);
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        authGoogleServiceSpy.accessToken$ = of('mockToken');
        httpAuthServiceSpy.getUserData.and.returnValue(
            of({
                role: 'MANAGER',
                name: 'New User',
                surname: 'surname',
                email: 'new@example.com',
            })
        );

        TestBed.configureTestingModule({
            providers: [
                AuthService,
                { provide: AuthGoogleService, useValue: authGoogleServiceSpy },
                { provide: AuthHttpService, useValue: httpAuthServiceSpy },
                { provide: SnackbarService, useValue: snackbarServiceSpy },
                { provide: Router, useValue: routerSpy },
            ],
        });

        service = TestBed.inject(AuthService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should log in and navigate to home on successful login', () => {
        const loginForm: LoginForm = {
            email: 'test@example.com',
            password: 'password',
        };
        const mockResponse = {
            user: {
                role: 'MANAGER',
                name: 'New User',
                surname: 'surname',
                email: 'new@example.com',
            },
            token: {
                accessToken: 'newAccessToken',
                refreshToken: 'refreshToken',
            },
        };
        httpAuthServiceSpy.login.and.returnValue(of(mockResponse));

        service.login(loginForm);

        expect(httpAuthServiceSpy.login).toHaveBeenCalledWith(loginForm);
        expect(localStorage.getItem('userInfo')).toEqual(
            JSON.stringify(mockResponse.user)
        );
        expect(localStorage.getItem('accessToken')).toBe(
            mockResponse.token.accessToken
        );
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should show error message on failed login', () => {
        httpAuthServiceSpy.login.and.returnValue(throwError('error'));
        const loginForm: LoginForm = {
            email: 'test@example.com',
            password: 'wrongpassword',
        };

        service.login(loginForm);

        expect(snackbarServiceSpy.openSnackBar).toHaveBeenCalledWith(
            'Check your Email and Password and try again'
        );
    });

    it('should register and navigate to home on successful registration', () => {
        const registerForm: RegisterForm = {
            email: 'new@example.com',
            password: 'newpassword',
            name: 'New User',
            surname: 'surname',
        };
        const mockResponse = {
            user: {
                role: 'MANAGER',
                name: 'New User',
                surname: 'surname',
                email: 'new@example.com',
            },
            token: {
                accessToken: 'newAccessToken',
                refreshToken: 'refreshToken',
            },
        };
        httpAuthServiceSpy.register.and.returnValue(of(mockResponse));

        service.register(registerForm);

        expect(httpAuthServiceSpy.register).toHaveBeenCalledWith(registerForm);
        expect(localStorage.getItem('userInfo')).toEqual(
            JSON.stringify(mockResponse.user)
        );
        expect(localStorage.getItem('accessToken')).toBe(
            mockResponse.token.accessToken
        );
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should show error message on failed registration', () => {
        httpAuthServiceSpy.register.and.returnValue(throwError('error'));
        const registerForm: RegisterForm = {
            email: 'new@example.com',
            password: 'newpassword',
            name: 'New User',
            surname: 'surname',
        };

        service.register(registerForm);

        expect(snackbarServiceSpy.openSnackBar).toHaveBeenCalledWith(
            INVALID_FORM_MESSAGE
        );
    });

    it('should log out and remove user data from localStorage', () => {
        spyOn(localStorage, 'removeItem').and.callThrough();
        authGoogleServiceSpy.isLoggedIn.and.returnValue(true);

        service.logout();

        expect(authGoogleServiceSpy.logout).toHaveBeenCalled();
        expect(localStorage.removeItem).toHaveBeenCalledWith('userInfo');
        expect(localStorage.removeItem).toHaveBeenCalledWith('accessToken');
    });

    it('should call AuthGoogleService login for loginViaGoogle', () => {
        service.loginViaGoogle();
        expect(authGoogleServiceSpy.login).toHaveBeenCalled();
    });

    it('should return true if accessToken is present in localStorage', () => {
        localStorage.setItem('accessToken', 'mockToken');
        expect(service.isLoggedIn()).toBeTrue();
    });

    it('should return false if accessToken is not present in localStorage', () => {
        localStorage.removeItem('accessToken');
        expect(service.isLoggedIn()).toBeFalse();
    });

    it('should return true if user role is MANAGER', () => {
        const mockUser: UserInfo = {
            role: 'MANAGER',
            name: 'Manager',
            surname: 'surname',
            email: 'email',
        };
        localStorage.setItem('userInfo', JSON.stringify(mockUser));

        expect(service.isManager()).toBeTrue();
    });

    it('should return false if user role is not MANAGER', () => {
        const mockUser: UserInfo = {
            role: 'USER',
            name: 'User',
            surname: 'surname',
            email: 'email',
        };
        localStorage.setItem('userInfo', JSON.stringify(mockUser));

        expect(service.isManager()).toBeFalse();
    });

    it('should return parsed userInfo if present in localStorage', () => {
        const mockUser: UserInfo = {
            role: 'USER',
            name: 'Test User',
            surname: 'surname',
            email: 'email',
        };
        localStorage.setItem('userInfo', JSON.stringify(mockUser));

        expect(service.getUserInfo()).toEqual(mockUser);
    });

    it('should return null if userInfo is not present in localStorage', () => {
        localStorage.removeItem('userInfo');
        expect(service.getUserInfo()).toBeNull();
    });

    it('should update localStorage with user data when getUserData is called', () => {
        const mockUserData: UserInfo = {
            role: 'USER',
            name: 'User Data',
            surname: 'surname',
            email: 'email',
        };
        httpAuthServiceSpy.getUserData.and.returnValue(of(mockUserData));

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (service as any).getUserData();

        expect(localStorage.getItem('userInfo')).toEqual(
            JSON.stringify(mockUserData)
        );
    });
});

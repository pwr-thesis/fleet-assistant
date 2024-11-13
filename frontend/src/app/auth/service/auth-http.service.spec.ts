import { TestBed } from '@angular/core/testing';
import {
    HttpClientTestingModule,
    HttpTestingController,
} from '@angular/common/http/testing';
import { AuthHttpService } from './auth-http.service';
import { AuthResponse, LoginForm, RegisterForm, UserInfo } from '../types/auth';
import {
    LOGIN_URL,
    REGISTER_URL,
    USER_INFO_URL,
} from '../../../utilities/_urls';

describe('AuthHttpService', () => {
    let service: AuthHttpService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [AuthHttpService],
        });
        service = TestBed.inject(AuthHttpService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should call login API with correct URL and data', () => {
        const loginForm: LoginForm = {
            email: 'test@example.com',
            password: 'password',
        };
        const mockResponse: AuthResponse = {
            user: {
                role: 'USER',
                name: 'Test User',
                surname: 'surname',
                email: 'test@example.com',
            },
            token: {
                accessToken: 'mockAccessToken',
                refreshToken: 'mockRefreshToken',
            },
        };

        service.login(loginForm).subscribe((response) => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(LOGIN_URL);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(loginForm);

        req.flush(mockResponse);
    });

    it('should call register API with correct URL and data', () => {
        const registerForm: RegisterForm = {
            email: 'new@example.com',
            password: 'newpassword',
            name: 'New',
            surname: 'User',
        };
        const mockResponse: AuthResponse = {
            user: {
                role: 'USER',
                name: 'New',
                surname: 'User',
                email: 'new@example.com',
            },
            token: {
                accessToken: 'newAccessToken',
                refreshToken: 'newRefreshToken',
            },
        };

        service.register(registerForm).subscribe((response) => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(REGISTER_URL);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(registerForm);

        req.flush(mockResponse);
    });

    it('should call getUserData API with correct URL', () => {
        const mockUserInfo: UserInfo = {
            role: 'USER',
            name: 'User Data',
            surname: 'surname',
            email: 'email@example.com',
        };

        service.getUserData().subscribe((response) => {
            expect(response).toEqual(mockUserInfo);
        });

        const req = httpMock.expectOne(USER_INFO_URL);
        expect(req.request.method).toBe('GET');

        req.flush(mockUserInfo);
    });
});

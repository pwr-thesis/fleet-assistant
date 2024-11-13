import { TestBed } from '@angular/core/testing';
import { AuthGoogleService } from './auth-google.service';
import {
    OAuthService,
    AuthConfig,
    OAuthSuccessEvent,
} from 'angular-oauth2-oidc';

describe('AuthGoogleService', () => {
    let service: AuthGoogleService;
    let oauthServiceSpy: jasmine.SpyObj<OAuthService>;

    beforeEach(() => {
        oauthServiceSpy = jasmine.createSpyObj<OAuthService>('OAuthService', [
            'configure',
            'setupAutomaticSilentRefresh',
            'loadDiscoveryDocument',
            'tryLoginImplicitFlow',
            'hasValidAccessToken',
            'initLoginFlow',
            'revokeTokenAndLogout',
            'logOut',
            'getIdToken',
        ]);

        oauthServiceSpy.loadDiscoveryDocument.and.returnValue(
            Promise.resolve() as unknown as Promise<OAuthSuccessEvent>
        );
        oauthServiceSpy.tryLoginImplicitFlow.and.returnValue(
            Promise.resolve(true)
        );

        TestBed.configureTestingModule({
            providers: [
                AuthGoogleService,
                { provide: OAuthService, useValue: oauthServiceSpy },
            ],
        });

        service = TestBed.inject(AuthGoogleService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should configure OAuthService on initialization', () => {
        service.initConfiguration();
        expect(oauthServiceSpy.configure).toHaveBeenCalledWith(
            jasmine.objectContaining<AuthConfig>({
                issuer: 'https://accounts.google.com',
                clientId: jasmine.any(String),
                redirectUri: window.location.origin,
                scope: jasmine.any(String),
            })
        );
        expect(oauthServiceSpy.setupAutomaticSilentRefresh).toHaveBeenCalled();
        expect(oauthServiceSpy.loadDiscoveryDocument).toHaveBeenCalled();
    });

    it('should not call initLoginFlow if a valid access token already exists on login', async () => {
        oauthServiceSpy.hasValidAccessToken.and.returnValue(true);
        service.login();
        expect(oauthServiceSpy.initLoginFlow).not.toHaveBeenCalled();
    });

    it('should update accessTokenSubject to empty string on logout', () => {
        service.logout();
        expect(oauthServiceSpy.revokeTokenAndLogout).toHaveBeenCalled();
        expect(oauthServiceSpy.logOut).toHaveBeenCalled();
        service.accessToken$.subscribe((token) => {
            expect(token).toBe('');
        });
    });

    it('should return the correct token from getToken', () => {
        const mockToken = 'mock-id-token';
        oauthServiceSpy.getIdToken.and.returnValue(mockToken);
        expect(service.getToken()).toBe(mockToken);
    });

    it('should return true when isLoggedIn is called and access token is valid', () => {
        oauthServiceSpy.hasValidAccessToken.and.returnValue(true);
        expect(service.isLoggedIn()).toBeTrue();
    });

    it('should return false when isLoggedIn is called and access token is invalid', () => {
        oauthServiceSpy.hasValidAccessToken.and.returnValue(false);
        expect(service.isLoggedIn()).toBeFalse();
    });
});

import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environment/environment';

@Injectable({
    providedIn: 'root',
})
export class AuthGoogleService {
    private accessTokenSubject: BehaviorSubject<string | undefined> =
        new BehaviorSubject<string | undefined>(undefined);
    accessToken$: Observable<string | undefined> =
        this.accessTokenSubject.asObservable();

    constructor(private oauthService: OAuthService) {
        this.initConfiguration();
    }

    initConfiguration(): void {
        const authConfig: AuthConfig = {
            issuer: 'https://accounts.google.com',
            strictDiscoveryDocumentValidation: false,
            redirectUri: window.location.origin,
            clientId: environment.oidcClientId,
            scope: 'openid profile email https://www.googleapis.com/auth/gmail.readonly',
        };

        this.oauthService.configure(authConfig);
        this.oauthService.setupAutomaticSilentRefresh(undefined, 'id_token');

        this.oauthService.loadDiscoveryDocument().then(() => {
            this.oauthService.tryLoginImplicitFlow().then(() => {
                if (this.oauthService.hasValidAccessToken()) {
                    this.accessTokenSubject.next(this.getToken());
                } else {
                    this.accessTokenSubject.next('');
                }
            });
        });
    }

    login(): void {
        this.oauthService.loadDiscoveryDocument().then(() => {
            this.oauthService.tryLoginImplicitFlow().then(() => {
                if (!this.oauthService.hasValidAccessToken()) {
                    this.oauthService.initLoginFlow();
                }
            });
        });
    }

    logout(): void {
        this.oauthService.revokeTokenAndLogout();
        this.oauthService.logOut();
        this.accessTokenSubject.next('');
    }

    getToken(): string {
        return this.oauthService.getIdToken();
    }

    isLoggedIn(): boolean {
        return this.oauthService.hasValidAccessToken();
    }
}

import { AuthConfig } from 'angular-oauth2-oidc';
import { Observable, of } from 'rxjs';

export class MockOAuthService {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    initCodeFlow(): void {}

    loadDiscoveryDocument(): Promise<boolean> {
        return Promise.resolve(true);
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    loadDiscoveryDocumentAndTryLogin(): void {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
    configure(config: AuthConfig): void {}

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setupAutomaticSilentRefresh(): void {}

    get accessToken$(): Observable<string> {
        return of('mock-token');
    }

    hasValidAccessToken(): boolean {
        return true;
    }

    getIdToken(): string {
        return 'mock-id-token';
    }

    tryLoginImplicitFlow(): Promise<void> {
        return Promise.resolve();
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    initLoginFlow(): void {}

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    revokeTokenAndLogout(): void {}

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    logOut(): void {}
}

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { NavbarService } from '../utilities/services/navbar.service';
import { HeaderComponent } from './common/components/header/header.component';
import { FooterComponent } from './common/components/footer/footer.component';
import { SidenavComponent } from './common/components/sidenav/sidenav.component';
import { BottomNavComponent } from './common/components/bottom-nav/bottom-nav.component';
import { RouterTestingModule } from '@angular/router/testing';
import {Observable, of} from 'rxjs';
import { Renderer2 } from '@angular/core';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AppComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let navbarServiceMock: jasmine.SpyObj<NavbarService>;
    let rendererMock: jasmine.SpyObj<Renderer2>;

    class MockOAuthService {
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
            return of('mock-token'); // Return a mock token
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


    beforeEach(async () => {
        navbarServiceMock = jasmine.createSpyObj('NavbarService', ['showNavbar$']);
        rendererMock = jasmine.createSpyObj('Renderer2', ['createElement', 'appendChild']);

        navbarServiceMock.showNavbar$ = of(true);

        await TestBed.configureTestingModule({
            imports: [
                AppComponent,
                HeaderComponent,
                FooterComponent,
                SidenavComponent,
                BottomNavComponent,
                RouterTestingModule,
                HttpClientTestingModule,
            ],
            providers: [
                { provide: NavbarService, useValue: navbarServiceMock },
                { provide: Renderer2, useValue: rendererMock },
                { provide: OAuthService, useClass: MockOAuthService },
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });
});

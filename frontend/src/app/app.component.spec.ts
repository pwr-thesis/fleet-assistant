import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { NavbarService } from '../utilities/services/navbar.service';
import { HeaderComponent } from './common/components/header/header.component';
import { FooterComponent } from './common/components/footer/footer.component';
import { SidenavComponent } from './common/components/sidenav/sidenav.component';
import { BottomNavComponent } from './common/components/bottom-nav/bottom-nav.component';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { Renderer2 } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockOAuthService } from '../utilities/tests/_mocks';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AppComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let navbarServiceMock: jasmine.SpyObj<NavbarService>;
    let rendererMock: jasmine.SpyObj<Renderer2>;

    beforeEach(async () => {
        navbarServiceMock = jasmine.createSpyObj('NavbarService', [
            'showNavbar$',
        ]);
        rendererMock = jasmine.createSpyObj('Renderer2', [
            'createElement',
            'appendChild',
        ]);

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
                BrowserAnimationsModule,
            ],
            providers: [
                { provide: NavbarService, useValue: navbarServiceMock },
                { provide: Renderer2, useValue: rendererMock },
                { provide: OAuthService, useClass: MockOAuthService },
            ],
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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidenavComponent } from './sidenav.component';
import { AuthService } from '../../../auth/service/auth.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { NavButtonComponent } from '../nav-button/nav-button.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SidenavComponent', () => {
    let component: SidenavComponent;
    let fixture: ComponentFixture<SidenavComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [],
            imports: [
                MatSidenavModule,
                MatIconModule,
                RouterTestingModule,
                SidenavComponent,
                NavButtonComponent,
                BrowserAnimationsModule,
            ],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        isLoggedIn: jasmine.createSpy().and.returnValue(true),
                        isManager: jasmine.createSpy().and.returnValue(true),
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SidenavComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should toggle menu state when toolbar menu icon is clicked', () => {
        const toolbarMenu = fixture.debugElement.query(By.css('#toolbarMenu'));

        toolbarMenu.triggerEventHandler('click', null);
        fixture.detectChanges();

        expect(component.isMenuOpen).toBeTrue();
        expect(component.contentMargin).toBe(240);

        toolbarMenu.triggerEventHandler('click', null);
        fixture.detectChanges();

        expect(component.isMenuOpen).toBeFalse();
        expect(component.contentMargin).toBe(70);
    });

    it('should show Dashboard and Vehicles buttons when logged in', () => {
        const dashboardButton = fixture.debugElement.query(
            By.css('app-nav-button[link="/dashboard"]')
        );
        const vehiclesButton = fixture.debugElement.query(
            By.css('app-nav-button[link="/vehicles"]')
        );

        expect(dashboardButton).toBeTruthy();
        expect(vehiclesButton).toBeTruthy();
    });

    it('should show Locations and Drivers buttons when logged in as a manager', () => {
        const locationsButton = fixture.debugElement.query(
            By.css('app-nav-button[link="/locations"]')
        );
        const driversButton = fixture.debugElement.query(
            By.css('app-nav-button[link="/drivers"]')
        );

        expect(locationsButton).toBeTruthy();
        expect(driversButton).toBeTruthy();
    });
});

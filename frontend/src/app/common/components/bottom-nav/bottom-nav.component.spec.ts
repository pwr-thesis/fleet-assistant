import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BottomNavComponent } from './bottom-nav.component';
import { AuthService } from '../../../auth/service/auth.service';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('BottomNavComponent', () => {
    let fixture: ComponentFixture<BottomNavComponent>;
    let authService: jasmine.SpyObj<AuthService>;

    const activatedRouteMock = {
        snapshot: {
            queryParamMap: of(new Map([['someParam', 'value']])),
        },
    };

    beforeEach(async () => {
        const authServiceSpy = jasmine.createSpyObj('AuthService', [
            'isLoggedIn',
            'isManager',
        ]);
        await TestBed.configureTestingModule({
            imports: [BottomNavComponent, MatIcon, RouterLink],
            providers: [
                { provide: ActivatedRoute, useValue: activatedRouteMock },
                { provide: AuthService, useValue: authServiceSpy },
            ],
        }).compileComponents();

        authService = TestBed.inject(
            AuthService
        ) as jasmine.SpyObj<AuthService>;
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BottomNavComponent);
        fixture.detectChanges();
    });

    it('should not render the bottom nav when not logged in', () => {
        authService.isLoggedIn.and.returnValue(false);
        fixture.detectChanges();

        const bottomNav = fixture.debugElement.query(By.css('div[ngIf]'));
        expect(bottomNav).toBeFalsy();
    });

    it('should render the bottom nav when logged in', async () => {
        authService.isLoggedIn.and.returnValue(true);
        fixture.detectChanges();
        await fixture.whenStable();

        const bottomNav = fixture.debugElement.query(By.css('div.fixed'));
        expect(bottomNav).toBeTruthy();
    });

    it('should show the correct number of columns for managers', () => {
        authService.isLoggedIn.and.returnValue(true);
        authService.isManager.and.returnValue(true);
        fixture.detectChanges();

        const grid = fixture.debugElement.query(By.css('.grid'));
        expect(grid.classes['grid-cols-4']).toBeTruthy();
    });

    it('should show the correct number of columns for non-managers', () => {
        authService.isLoggedIn.and.returnValue(true);
        authService.isManager.and.returnValue(false);
        fixture.detectChanges();

        const grid = fixture.debugElement.query(By.css('.grid'));
        expect(grid.classes['grid-cols-2']).toBeTruthy();
    });

    it('should render the Locations button for managers', () => {
        authService.isLoggedIn.and.returnValue(true);
        authService.isManager.and.returnValue(true);
        fixture.detectChanges();

        const locationButton = fixture.debugElement.query(
            By.css('button[routerLink="/locations"]')
        );
        expect(locationButton).toBeTruthy();
    });

    it('should not render the Locations button for non-managers', () => {
        authService.isLoggedIn.and.returnValue(true);
        authService.isManager.and.returnValue(false);
        fixture.detectChanges();

        const locationButton = fixture.debugElement.query(
            By.css('button[routerLink="/locations"]')
        );
        expect(locationButton).toBeFalsy();
    });

    it('should render the Drivers button for managers', () => {
        authService.isLoggedIn.and.returnValue(true);
        authService.isManager.and.returnValue(true);
        fixture.detectChanges();

        const driversButton = fixture.debugElement.query(
            By.css('button[routerLink="/drivers"]')
        );
        expect(driversButton).toBeTruthy();
    });

    it('should not render the Drivers button for non-managers', () => {
        authService.isLoggedIn.and.returnValue(true);
        authService.isManager.and.returnValue(false);
        fixture.detectChanges();

        const driversButton = fixture.debugElement.query(
            By.css('button[routerLink="/drivers"]')
        );
        expect(driversButton).toBeFalsy();
    });

    it('should render Dashboard and Vehicles buttons for everyone', () => {
        authService.isLoggedIn.and.returnValue(true);
        fixture.detectChanges();

        const dashboardButton = fixture.debugElement.query(
            By.css('button[routerLink="/dashboard"]')
        );
        const vehiclesButton = fixture.debugElement.query(
            By.css('button[routerLink="/vehicles"]')
        );

        expect(dashboardButton).toBeTruthy();
        expect(vehiclesButton).toBeTruthy();
    });
});

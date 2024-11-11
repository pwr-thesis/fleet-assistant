import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AuthService } from '../../../auth/service/auth.service';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

describe('HeaderComponent', () => {
    let fixture: ComponentFixture<HeaderComponent>;
    let authServiceSpy: jasmine.SpyObj<AuthService>;

    beforeEach(async () => {
        authServiceSpy = jasmine.createSpyObj('AuthService', [
            'isLoggedIn',
            'getUserInfo',
        ]);

        await TestBed.configureTestingModule({
            imports: [RouterTestingModule, HeaderComponent],
            providers: [{ provide: AuthService, useValue: authServiceSpy }],
        }).compileComponents();

        fixture = TestBed.createComponent(HeaderComponent);
    });

    it('should display Sign In and Sign Up links when not logged in', () => {
        authServiceSpy.isLoggedIn.and.returnValue(false);

        fixture.detectChanges();

        const signInLink = fixture.debugElement.query(
            By.css('a[routerLink="/login"]')
        );
        const signUpLink = fixture.debugElement.query(
            By.css('a[routerLink="/register"]')
        );

        expect(signInLink).not.toBeNull();
        expect(signUpLink).not.toBeNull();
    });

    it('should display user role and username when logged in', () => {
        authServiceSpy.isLoggedIn.and.returnValue(true);

        authServiceSpy.getUserInfo.and.returnValue({
            name: 'John',
            surname: 'Doe',
            email: 'john.doe@example.com',
            role: 'Admin',
        });

        fixture.detectChanges();

        const userRole = fixture.debugElement.query(
            By.css('.user-info')
        ).nativeElement;
        const userName = fixture.debugElement.queryAll(By.css('.user-info'))[1]
            .nativeElement;

        expect(userRole.textContent).toBe('Admin');
        expect(userName.textContent).toBe('John Doe, john.doe@example.com');
    });
});

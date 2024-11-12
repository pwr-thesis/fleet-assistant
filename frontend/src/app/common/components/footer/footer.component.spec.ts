import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { AuthService } from '../../../auth/service/auth.service';
import { By } from '@angular/platform-browser';
import { MatToolbar } from '@angular/material/toolbar';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('FooterComponent', () => {
    let fixture: ComponentFixture<FooterComponent>;
    let authServiceSpy: jasmine.SpyObj<AuthService>;

    beforeEach(async () => {
        authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
        await TestBed.configureTestingModule({
            imports: [FooterComponent, MatToolbar],
            providers: [{ provide: AuthService, useValue: authServiceSpy }],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(FooterComponent);
    });

    it('should display the footer correctly when logged out', () => {
        authServiceSpy.isLoggedIn.and.returnValue(false);
        fixture.detectChanges();

        const footer = fixture.debugElement.query(By.css('footer'));
        const div = fixture.debugElement.query(By.css('div'));

        expect(div).toBeNull();

        expect(footer.styles['display']).toBe('flex');
    });

    it('should display the footer correctly with the links when logged out', () => {
        authServiceSpy.isLoggedIn.and.returnValue(false);
        fixture.detectChanges();

        const footerLinks = fixture.debugElement.queryAll(By.css('.link'));

        expect(footerLinks.length).toBe(3);
    });
});

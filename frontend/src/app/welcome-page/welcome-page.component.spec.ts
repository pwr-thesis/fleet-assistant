import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WelcomePageComponent } from './welcome-page.component';
import { DoubleColumnParagraphComponent } from '../common/components/double-column-paragraph/double-column-paragraph.component';
import { ContactFormComponent } from '../common/components/contact-form/contact-form.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { NavbarService } from '../../utilities/services/navbar.service';
import { Renderer2 } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { MockOAuthService } from '../../utilities/tests/_mocks';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('WelcomePageComponent', () => {
    let component: WelcomePageComponent;
    let fixture: ComponentFixture<WelcomePageComponent>;

    beforeEach(async () => {
        const navbarServiceMock = jasmine.createSpyObj('NavbarService', [
            'showNavbar$',
        ]);
        const rendererMock = jasmine.createSpyObj('Renderer2', [
            'createElement',
            'appendChild',
        ]);

        navbarServiceMock.showNavbar$ = of(true);
        await TestBed.configureTestingModule({
            declarations: [],
            imports: [
                RouterTestingModule,
                WelcomePageComponent,
                DoubleColumnParagraphComponent,
                ContactFormComponent,
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
        fixture = TestBed.createComponent(WelcomePageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should render the top-section', () => {
        const topSection = fixture.debugElement.query(By.css('#top-section'));
        expect(topSection).toBeTruthy();
    });

    it('should contain links in top-section', () => {
        const links = fixture.debugElement.queryAll(By.css('#top-section a'));
        expect(links.length).toBe(3);
        expect(links[0].nativeElement.getAttribute('routerLink')).toBe(
            '/management-info'
        );
        expect(links[1].nativeElement.getAttribute('routerLink')).toBe(
            '/maintenance-info'
        );
        expect(links[2].nativeElement.getAttribute('routerLink')).toBe(
            '/tracking-info'
        );
    });

    it('should display image in the top-section with alt text "Management"', () => {
        const img = fixture.debugElement.query(
            By.css('#top-section .image-item img[alt="Management"]')
        );
        expect(img).toBeTruthy();
    });

    it('should render the Ultimate Solution section with app-double-column-paragraph', () => {
        const ultimateSolutionSection = fixture.debugElement.query(
            By.css('#ultimate-solution app-double-column-paragraph')
        );
        expect(ultimateSolutionSection).toBeTruthy();
    });

    it('should render the Easy and Intuitive section with app-double-column-paragraph reversed', () => {
        const intuitiveSection = fixture.debugElement.query(
            By.css('#intuitive app-double-column-paragraph')
        );
        expect(intuitiveSection).toBeTruthy();
        expect(intuitiveSection.attributes['ng-reflect-reversed']).toBe('true');
    });

    it('should render the Contact Us section with app-contact-form', () => {
        const contactSection = fixture.debugElement.query(
            By.css('#contact app-contact-form')
        );
        expect(contactSection).toBeTruthy();
    });

    it('should have an img element with the correct alt text in the Ultimate Solution section', () => {
        const img = fixture.debugElement.query(
            By.css('#ultimate-solution img[alt="Ultimate Solution"]')
        );
        expect(img).toBeTruthy();
    });

    it('should have an img element with the correct alt text in the Easy and Intuitive section', () => {
        const img = fixture.debugElement.query(
            By.css('#intuitive img[alt="Easy and Intuitive"]')
        );
        expect(img).toBeTruthy();
    });

    it('should render the Contact Form component inside the Contact section', () => {
        const contactForm = fixture.debugElement.query(
            By.css('#contact app-contact-form')
        );
        expect(contactForm).toBeTruthy();
    });
});

import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NavbarService } from './navbar.service';
import { BehaviorSubject } from 'rxjs';
import { NavigationEnd } from '@angular/router';

describe('NavbarService', () => {
    let service: NavbarService;
    let router: Router;

    beforeEach(() => {
        const mockRouter = {
            events: new BehaviorSubject(new NavigationEnd(0, '', '')),
            url: '/home',
        };

        TestBed.configureTestingModule({
            providers: [
                NavbarService,
                { provide: Router, useValue: mockRouter },
            ],
        });

        service = TestBed.inject(NavbarService);
        router = TestBed.inject(Router);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should set showNavbar$ to false for routes that should hide the navbar', () => {
        const hideRoute = '/some-hide-route';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (router as any).url = hideRoute;
        service = TestBed.inject(NavbarService);

        service.showNavbar$.subscribe((showNavbar) => {
            expect(showNavbar).toBeFalse();
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (router.events as BehaviorSubject<any>).next(
            new NavigationEnd(0, hideRoute, hideRoute)
        );
    });
});

import { Injectable } from '@angular/core';
import { BehaviorSubject, filter } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { HIDE_NAVBAR_ROUTES } from '../_constants';

@Injectable({
    providedIn: 'root',
})
export class NavbarService {
    private showNavbarSubject = new BehaviorSubject<boolean>(true);
    showNavbar$ = this.showNavbarSubject.asObservable();

    constructor(private router: Router) {
        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe(() => {
                const shouldShowNavbar = HIDE_NAVBAR_ROUTES.some((route) =>
                    this.router.url.includes(route)
                );
                this.showNavbarSubject.next(shouldShowNavbar);
            });
    }
}

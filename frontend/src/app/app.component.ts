import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './common/components/header/header.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { FooterComponent } from './common/components/footer/footer.component';
import { NgIf } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { NavbarService } from '../utilities/services/navbar.service';
import { SidenavComponent } from './common/components/sidenav/sidenav.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        HeaderComponent,
        WelcomePageComponent,
        FooterComponent,
        NgIf,
        SidenavComponent,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    showNavbar = true;
    private destroy$ = new Subject<void>();

    constructor(private navbarService: NavbarService) {
        this.navbarService.showNavbar$
            .pipe(takeUntil(this.destroy$))
            .subscribe((show) => {
                this.showNavbar = show;
            });
    }
}

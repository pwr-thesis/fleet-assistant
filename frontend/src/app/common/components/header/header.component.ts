import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatIconButton } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/service/auth.service';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [
        MatToolbarModule,
        MatIcon,
        MatCheckbox,
        MatMenuTrigger,
        MatMenu,
        MatIconButton,
        MatMenuItem,
        RouterLink,
        NgIf,
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
})
export class HeaderComponent {
    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    onLogOut(): void {
        window.location.reload();
        this.authService.logout();
    }

    isLogedIn(): boolean {
        return this.authService.isLoggedIn();
    }

    getUsername(): string {
        return (
            this.authService.getUserInfo()?.name +
            ' ' +
            this.authService.getUserInfo()?.surname +
            ', ' +
            this.authService.getUserInfo()?.email
        );
    }

    getUserRole(): string {
        switch (this.authService.getUserInfo()?.role) {
            case 'Manager':
                return 'MANAGER';
            case 'Driver':
                return 'DRIVER';
            default:
                return '';
        }
    }
}

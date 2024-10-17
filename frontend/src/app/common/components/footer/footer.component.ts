import { Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { NgIf, NgStyle } from '@angular/common';
import { AuthService } from '../../../auth/service/auth.service';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [MatToolbar, NgIf, NgStyle],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss',
})
export class FooterComponent {
    constructor(private authService: AuthService) {}

    isLoggedIn(): boolean {
        return this.authService.isLoggedIn();
    }
}

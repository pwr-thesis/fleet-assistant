import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import {NgIf} from "@angular/common";
import {AuthService} from "../../../auth/service/auth.service";

@Component({
    selector: 'app-bottom-nav',
    standalone: true,
    imports: [MatIcon, RouterLink, NgIf],
    templateUrl: './bottom-nav.component.html',
    styleUrl: './bottom-nav.component.scss',
})
export class BottomNavComponent {
    constructor(private authService: AuthService) {
    }

    isLoggedIn(): boolean {
        return this.authService.isLoggedIn();
    }
}

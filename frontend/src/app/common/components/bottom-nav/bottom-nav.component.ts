import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-bottom-nav',
    standalone: true,
    imports: [MatIcon, RouterLink],
    templateUrl: './bottom-nav.component.html',
    styleUrl: './bottom-nav.component.scss',
})
export class BottomNavComponent {}

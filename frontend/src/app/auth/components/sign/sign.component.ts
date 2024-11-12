import { Component } from '@angular/core';
import { MatFabAnchor } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-sign',
    standalone: true,
    imports: [MatFabAnchor, MatIcon, RouterLink],
    templateUrl: './sign.component.html',
    styleUrl: './sign.component.scss',
})
export class SignComponent {}

import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { NgClass, NgIf, NgStyle } from '@angular/common';

@Component({
    selector: 'app-nav-button',
    standalone: true,
    imports: [MatIcon, MatButton, RouterLink, NgClass, NgStyle, NgIf],
    templateUrl: './nav-button.component.html',
    styleUrl: './nav-button.component.scss',
})
export class NavButtonComponent {
    @Input({ required: true }) iconName?: string;
    @Input({ required: true }) link?: string;
    @Input({ required: true }) text?: string;
    @Input({ required: true }) isTextVisible?: boolean;
}

import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatDivider } from '@angular/material/divider';
import {
    MatList,
    MatListItem,
    MatListOption,
    MatSelectionList,
} from '@angular/material/list';
import {
    MatCard,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle,
} from '@angular/material/card';
import { NgStyle } from '@angular/common';
import { MatToolbar } from '@angular/material/toolbar';
import { MatBadge } from '@angular/material/badge';
import { NavButtonComponent } from '../../common/nav-button/nav-button.component';

@Component({
    selector: 'app-sidenav',
    standalone: true,
    imports: [
        MatSidenavModule,
        MatCheckboxModule,
        FormsModule,
        MatButtonModule,
        MatIcon,
        RouterLink,
        MatDivider,
        MatListItem,
        MatCardTitle,
        MatCardSubtitle,
        MatCardHeader,
        MatList,
        MatCard,
        NgStyle,
        MatSelectionList,
        MatListOption,
        MatToolbar,
        MatBadge,
        NavButtonComponent,
    ],
    templateUrl: './sidenav.component.html',
    styleUrl: './sidenav.component.scss',
})
export class SidenavComponent {
    isMenuOpen = false;
    contentMargin = 240;

    task: string[] = [
        'Clearning out my closet',
        'Take out trash bins',
        'Wash car',
        'Tank up the motorcycles',
        'Go for flight training',
    ];
    onToolbarMenuToggle(): void {
        console.log('On toolbar toggled', this.isMenuOpen);
        this.isMenuOpen = !this.isMenuOpen;

        if (!this.isMenuOpen) {
            this.contentMargin = 70;
        } else {
            this.contentMargin = 240;
        }
    }
}

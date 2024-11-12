import { Component } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';

@Component({
    selector: 'app-add-card',
    standalone: true,
    imports: [MatCard, MatCardContent],
    templateUrl: './add-card.component.html',
    styleUrl: './add-card.component.scss',
})
export class AddCardComponent {}

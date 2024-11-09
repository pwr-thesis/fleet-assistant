import { Component, Input } from '@angular/core';
import {
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle,
} from '@angular/material/card';
import { Driver } from '../../types/drivers';
import { CardFieldComponent } from '../../../common/components/card-field/card-field.component';
import { toDisplayDate } from '../../../../utilities/date-utils';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-driver-card',
    standalone: true,
    imports: [
        MatCard,
        MatCardHeader,
        MatCardTitle,
        CardFieldComponent,
        MatCardContent,
        MatCardSubtitle,
        NgIf,
    ],
    templateUrl: './driver-card.component.html',
    styleUrl: './driver-card.component.scss',
})
export class DriverCardComponent {
    @Input() driver!: Driver;

    protected readonly toDisplayDate = toDisplayDate;
}

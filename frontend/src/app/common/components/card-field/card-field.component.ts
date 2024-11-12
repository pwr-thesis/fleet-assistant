import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-card-field',
    standalone: true,
    imports: [],
    templateUrl: './card-field.component.html',
})
export class CardFieldComponent {
    @Input() fieldName!: string;
    @Input() fieldValue!: string;
}

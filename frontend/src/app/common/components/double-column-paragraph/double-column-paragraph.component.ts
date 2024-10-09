import { Component, Input, ViewEncapsulation } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-double-column-paragraph',
    standalone: true,
    imports: [NgClass],
    templateUrl: './double-column-paragraph.component.html',
    styleUrl: './double-column-paragraph.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class DoubleColumnParagraphComponent {
    @Input() reversed = false;
}

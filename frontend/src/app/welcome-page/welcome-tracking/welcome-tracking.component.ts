import { Component } from '@angular/core';
import { DoubleColumnParagraphComponent } from '../../common/components/double-column-paragraph/double-column-paragraph.component';

@Component({
    selector: 'app-welcome-tracking',
    standalone: true,
    imports: [DoubleColumnParagraphComponent],
    templateUrl: './welcome-tracking.component.html',
})
export class WelcomeTrackingComponent {}

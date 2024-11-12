import { Component } from '@angular/core';
import { DoubleColumnParagraphComponent } from '../../common/components/double-column-paragraph/double-column-paragraph.component';

@Component({
    selector: 'app-welcome-management',
    standalone: true,
    imports: [DoubleColumnParagraphComponent],
    templateUrl: './welcome-management.component.html',
})
export class WelcomeManagementComponent {}

import { Component } from '@angular/core';
import { DoubleColumnParagraphComponent } from '../../common/components/double-column-paragraph/double-column-paragraph.component';

@Component({
    selector: 'app-welcome-maintenance',
    standalone: true,
    imports: [DoubleColumnParagraphComponent],
    templateUrl: './welcome-maintenance.component.html',
})
export class WelcomeMaintenanceComponent {}

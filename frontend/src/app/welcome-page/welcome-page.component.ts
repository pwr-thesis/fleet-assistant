import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DoubleColumnParagraphComponent } from '../common/components/double-column-paragraph/double-column-paragraph.component';
import { ContactFormComponent } from '../common/components/contact-form/contact-form.component';

@Component({
    selector: 'app-welcome-page',
    standalone: true,
    imports: [DoubleColumnParagraphComponent, ContactFormComponent, RouterLink],
    templateUrl: './welcome-page.component.html',
    styleUrl: './welcome-page.component.scss',
})
export class WelcomePageComponent {}

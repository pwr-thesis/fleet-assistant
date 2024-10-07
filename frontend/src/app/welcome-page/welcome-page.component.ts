import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DoubleColumnParagraphComponent } from '../common/double-column-paragraph/double-column-paragraph.component';
import { ContactFormComponent } from '../common/contact-form/contact-form.component';

@Component({
    selector: 'app-welcome-page',
    standalone: true,
    imports: [DoubleColumnParagraphComponent, ContactFormComponent, RouterLink],
    templateUrl: './welcome-page.component.html',
    styleUrl: './welcome-page.component.scss',
})
export class WelcomePageComponent {}

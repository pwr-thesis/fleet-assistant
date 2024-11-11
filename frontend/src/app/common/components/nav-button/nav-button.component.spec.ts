import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavButtonComponent } from './nav-button.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('NavButtonComponent', () => {
    let component: NavButtonComponent;
    let fixture: ComponentFixture<NavButtonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NavButtonComponent, RouterTestingModule],
        }).compileComponents();

        fixture = TestBed.createComponent(NavButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should display the correct icon', () => {
        component.iconName = 'home';
        fixture.detectChanges();

        const iconElement = fixture.debugElement.query(
            By.css('mat-icon')
        ).nativeElement;
        expect(iconElement.textContent).toBe('home');
    });

    it('should apply the correct style when isTextVisible is true', () => {
        component.isTextVisible = true;
        fixture.detectChanges();

        const buttonElement = fixture.debugElement.query(
            By.css('button')
        ).nativeElement;
        const style = buttonElement.style.justifyContent;
        expect(style).toBe('start');
        expect(buttonElement.style.gap).toBe('1rem');
    });
});

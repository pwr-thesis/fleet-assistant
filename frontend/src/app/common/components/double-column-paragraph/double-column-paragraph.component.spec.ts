import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DoubleColumnParagraphComponent } from './double-column-paragraph.component';
import { By } from '@angular/platform-browser';

describe('DoubleColumnParagraphComponent', () => {
    let component: DoubleColumnParagraphComponent;
    let fixture: ComponentFixture<DoubleColumnParagraphComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DoubleColumnParagraphComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DoubleColumnParagraphComponent);
        component = fixture.componentInstance;
    });

    it('should have the correct default classes', () => {
        fixture.detectChanges();
        const divElement = fixture.debugElement.query(
            By.css('div')
        ).nativeElement;

        expect(
            divElement.classList.contains('double-column-paragraph')
        ).toBeTrue();
        expect(divElement.classList.contains('h-screen')).toBeTrue();
        expect(divElement.classList.contains('flex')).toBeTrue();
        expect(divElement.classList.contains('flex-row')).toBeTrue();
        expect(divElement.classList.contains('flex-row-reverse')).toBeFalse();
    });

    it('should add flex-row-reverse class when reversed is true', () => {
        component.reversed = true;
        fixture.detectChanges();

        const divElement = fixture.debugElement.query(
            By.css('div')
        ).nativeElement;

        expect(divElement.classList.contains('flex-row-reverse')).toBeTrue();
        expect(divElement.classList.contains('flex-row')).toBeFalse();
    });

    it('should not add flex-row-reverse class when reversed is false', () => {
        component.reversed = false;
        fixture.detectChanges();

        const divElement = fixture.debugElement.query(
            By.css('div')
        ).nativeElement;

        expect(divElement.classList.contains('flex-row-reverse')).toBeFalse();
        expect(divElement.classList.contains('flex-row')).toBeTrue();
    });
});

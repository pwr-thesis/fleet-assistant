import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { SignComponent } from './sign.component';

describe('SignComponent', () => {
    let component: SignComponent;
    let fixture: ComponentFixture<SignComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [],
            imports: [
                SignComponent,
                MatButtonModule,
                MatIconModule,
                RouterTestingModule,
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SignComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the sign component', () => {
        expect(component).toBeTruthy();
    });

    it('should display the image on large screens', () => {
        const image = fixture.debugElement.query(
            By.css('div.hidden.lg\\:block img')
        );
        expect(image).toBeTruthy();
        expect(image.nativeElement.src).toContain('management.jpg');
    });
});

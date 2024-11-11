import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleAddCardComponent } from './vehicle-add-card.component';
import { MatCardModule } from '@angular/material/card';
import { By } from '@angular/platform-browser';

describe('VehicleAddCardComponent', () => {
    let component: VehicleAddCardComponent;
    let fixture: ComponentFixture<VehicleAddCardComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MatCardModule, VehicleAddCardComponent],
            declarations: [],
        });

        fixture = TestBed.createComponent(VehicleAddCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should render mat-card with class "add-card"', () => {
        const cardElement = fixture.debugElement.query(By.css('mat-card.add-card'));
        expect(cardElement).toBeTruthy();
    });

    it('should have the correct class for the SVG', () => {
        const svgElement = fixture.debugElement.query(By.css('svg.w-full.h-full'));
        expect(svgElement).toBeTruthy();
    });
});

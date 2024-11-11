import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleCardFieldComponent } from './vehicle-card-field.component';
import { By } from '@angular/platform-browser';

describe('VehicleCardFieldComponent', () => {
    let component: VehicleCardFieldComponent;
    let fixture: ComponentFixture<VehicleCardFieldComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [VehicleCardFieldComponent],
        });

        fixture = TestBed.createComponent(VehicleCardFieldComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should display the fieldName with font-bold class', () => {
        component.fieldName = 'Name';
        fixture.detectChanges();

        const fieldNameElement = fixture.debugElement.query(By.css('span.font-bold'));
        expect(fieldNameElement).toBeTruthy();
        expect(fieldNameElement.nativeElement.textContent).toContain('Name:');
    });
});

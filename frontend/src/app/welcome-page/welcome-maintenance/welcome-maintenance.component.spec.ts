import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WelcomeMaintenanceComponent } from './welcome-maintenance.component';
import { DoubleColumnParagraphComponent } from '../../common/components/double-column-paragraph/double-column-paragraph.component';
import { By } from '@angular/platform-browser';

describe('WelcomeMaintenanceComponent', () => {
    let component: WelcomeMaintenanceComponent;
    let fixture: ComponentFixture<WelcomeMaintenanceComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                WelcomeMaintenanceComponent,
                DoubleColumnParagraphComponent,
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(WelcomeMaintenanceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should render the Comprehensive Maintenance Tracking section', () => {
        const maintenanceTracking = fixture.debugElement.query(
            By.css('app-double-column-paragraph:nth-of-type(1)')
        );
        expect(maintenanceTracking).toBeTruthy();

        const title = maintenanceTracking.query(By.css('h2')).nativeElement
            .textContent;
        expect(title).toBe('Comprehensive Maintenance Tracking');

        const paragraph = maintenanceTracking.query(By.css('p')).nativeElement
            .textContent;
        expect(paragraph).toContain(
            'Our fleet management software offers comprehensive maintenance tracking'
        );

        const img = maintenanceTracking.query(By.css('img'));
        expect(img).toBeTruthy();
        expect(img.nativeElement.getAttribute('alt')).toBe(
            'Maintenance Tracking'
        );
    });

    it('should render the Maintenance Reports section with reversed layout', () => {
        const maintenanceReports = fixture.debugElement.query(
            By.css('app-double-column-paragraph:nth-of-type(2)')
        );
        expect(maintenanceReports).toBeTruthy();

        const title = maintenanceReports.query(By.css('h2')).nativeElement
            .textContent;
        expect(title).toBe('Maintenance Reports');

        const paragraph = maintenanceReports.query(By.css('p')).nativeElement
            .textContent;
        expect(paragraph).toContain('Generate detailed maintenance reports');

        const img = maintenanceReports.query(By.css('img'));
        expect(img).toBeTruthy();
        expect(img.nativeElement.getAttribute('alt')).toBe(
            'Maintenance Reports'
        );

        const reversedAttr =
            maintenanceReports.attributes['ng-reflect-reversed'];
        expect(reversedAttr).toBe('true');
    });

    it('should render the Preventive Maintenance section', () => {
        const preventiveMaintenance = fixture.debugElement.query(
            By.css('app-double-column-paragraph:nth-of-type(3)')
        );
        expect(preventiveMaintenance).toBeTruthy();

        const title = preventiveMaintenance.query(By.css('h2')).nativeElement
            .textContent;
        expect(title).toBe('Preventive Maintenance');

        const paragraph = preventiveMaintenance.query(By.css('p')).nativeElement
            .textContent;
        expect(paragraph).toContain(
            'Implement preventive maintenance strategies'
        );

        const img = preventiveMaintenance.query(By.css('img'));
        expect(img).toBeTruthy();
        expect(img.nativeElement.getAttribute('alt')).toBe(
            'Preventive Maintenance'
        );
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WelcomeManagementComponent } from './welcome-management.component';
import { DoubleColumnParagraphComponent } from '../../common/components/double-column-paragraph/double-column-paragraph.component';
import { By } from '@angular/platform-browser';

describe('WelcomeManagementComponent', () => {
    let component: WelcomeManagementComponent;
    let fixture: ComponentFixture<WelcomeManagementComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                WelcomeManagementComponent,
                DoubleColumnParagraphComponent,
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(WelcomeManagementComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should render the Fleet Assistant Overview section', () => {
        const fleetOverview = fixture.debugElement.query(
            By.css('app-double-column-paragraph:nth-of-type(1)')
        );
        expect(fleetOverview).toBeTruthy();

        const title = fleetOverview.query(By.css('h2')).nativeElement
            .textContent;
        expect(title).toBe('Fleet Assistant Overview');

        const paragraph = fleetOverview.query(By.css('p')).nativeElement
            .textContent;
        expect(paragraph).toContain(
            "Our fleet management software provides a comprehensive overview of your fleet's operations"
        );

        const img = fleetOverview.query(By.css('img'));
        expect(img).toBeTruthy();
        expect(img.nativeElement.getAttribute('alt')).toBe(
            'Fleet Management Overview'
        );
    });

    it('should render the Driver Management section with reversed layout', () => {
        const driverManagement = fixture.debugElement.query(
            By.css('app-double-column-paragraph:nth-of-type(2)')
        );
        expect(driverManagement).toBeTruthy();

        const title = driverManagement.query(By.css('h2')).nativeElement
            .textContent;
        expect(title).toBe('Driver Management');

        const paragraph = driverManagement.query(By.css('p')).nativeElement
            .textContent;
        expect(paragraph).toContain(
            'Effectively manage your drivers with our software'
        );

        const img = driverManagement.query(By.css('img'));
        expect(img).toBeTruthy();
        expect(img.nativeElement.getAttribute('alt')).toBe('Driver Management');

        const reversedAttr = driverManagement.attributes['ng-reflect-reversed'];
        expect(reversedAttr).toBe('true');
    });

    it('should render the Operational Efficiency section', () => {
        const operationalEfficiency = fixture.debugElement.query(
            By.css('app-double-column-paragraph:nth-of-type(3)')
        );
        expect(operationalEfficiency).toBeTruthy();

        const title = operationalEfficiency.query(By.css('h2')).nativeElement
            .textContent;
        expect(title).toBe('Operational Efficiency');

        const paragraph = operationalEfficiency.query(By.css('p')).nativeElement
            .textContent;
        expect(paragraph).toContain(
            "Optimize your fleet's operational efficiency with our advanced analytics"
        );

        const img = operationalEfficiency.query(By.css('img'));
        expect(img).toBeTruthy();
        expect(img.nativeElement.getAttribute('alt')).toBe(
            'Operational Efficiency'
        );
    });
});

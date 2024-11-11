import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WelcomeTrackingComponent } from './welcome-tracking.component';
import { DoubleColumnParagraphComponent } from '../../common/components/double-column-paragraph/double-column-paragraph.component';
import { By } from '@angular/platform-browser';

describe('WelcomeTrackingComponent', () => {
    let component: WelcomeTrackingComponent;
    let fixture: ComponentFixture<WelcomeTrackingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [WelcomeTrackingComponent, DoubleColumnParagraphComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(WelcomeTrackingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should render the Real-Time Vehicles Tracking section', () => {
        const realTimeTracking = fixture.debugElement.query(
            By.css('app-double-column-paragraph:nth-of-type(1)')
        );
        expect(realTimeTracking).toBeTruthy();

        const title = realTimeTracking.query(By.css('h2')).nativeElement
            .textContent;
        expect(title).toBe('Real-Time Vehicles Tracking');

        const paragraph = realTimeTracking.query(By.css('p')).nativeElement
            .textContent;
        expect(paragraph).toContain(
            'Our fleet management software provides real-time vehicle tracking'
        );

        const img = realTimeTracking.query(By.css('img'));
        expect(img).toBeTruthy();
        expect(img.nativeElement.getAttribute('alt')).toBe(
            'Real-Time Vehicles Tracking'
        );
    });

    it('should render the Geofencing section with reversed layout', () => {
        const geofencing = fixture.debugElement.query(
            By.css('app-double-column-paragraph:nth-of-type(2)')
        );
        expect(geofencing).toBeTruthy();

        const title = geofencing.query(By.css('h2')).nativeElement.textContent;
        expect(title).toBe('Geofencing');

        const paragraph = geofencing.query(By.css('p')).nativeElement
            .textContent;
        expect(paragraph).toContain(
            'Set up geofences to receive alerts when vehicles enter or leave designated areas'
        );

        const img = geofencing.query(By.css('img'));
        expect(img).toBeTruthy();
        expect(img.nativeElement.getAttribute('alt')).toBe('Geofencing');

        const reversedAttr = geofencing.attributes['ng-reflect-reversed'];
        expect(reversedAttr).toBe('true');
    });

    it('should render the Route Optimization section', () => {
        const routeOptimization = fixture.debugElement.query(
            By.css('app-double-column-paragraph:nth-of-type(3)')
        );
        expect(routeOptimization).toBeTruthy();

        const title = routeOptimization.query(By.css('h2')).nativeElement
            .textContent;
        expect(title).toBe('Route Optimization');

        const paragraph = routeOptimization.query(By.css('p')).nativeElement
            .textContent;
        expect(paragraph).toContain(
            'Optimize routes to reduce fuel consumption and travel time'
        );

        const img = routeOptimization.query(By.css('img'));
        expect(img).toBeTruthy();
        expect(img.nativeElement.getAttribute('alt')).toBe(
            'Route Optimization'
        );
    });
});

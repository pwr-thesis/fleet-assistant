import { TestBed, ComponentFixture } from '@angular/core/testing';
import { VehiclesAllComponent } from './vehicles-all.component';
import { VehiclesService } from '../../service/vehicles.service';
import { AuthService } from '../../../auth/service/auth.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { MatPaginator } from '@angular/material/paginator';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('VehiclesAllComponent', () => {
    let component: VehiclesAllComponent;
    let fixture: ComponentFixture<VehiclesAllComponent>;
    let mockVehiclesService: jasmine.SpyObj<VehiclesService>;
    let mockAuthService: jasmine.SpyObj<AuthService>;

    beforeEach(async () => {
        mockVehiclesService = jasmine.createSpyObj('VehiclesService', [
            'getAllVehicles',
        ]);
        mockAuthService = jasmine.createSpyObj('AuthService', ['isManager']);

        await TestBed.configureTestingModule({
            imports: [
                VehiclesAllComponent,
                RouterTestingModule,
                BrowserAnimationsModule,
            ],
            providers: [
                { provide: VehiclesService, useValue: mockVehiclesService },
                { provide: AuthService, useValue: mockAuthService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(VehiclesAllComponent);
        component = fixture.componentInstance;

        mockVehiclesService.getAllVehicles.and.returnValue(
            of({
                content: [
                    {
                        id: 1,
                        name: 'Vehicle 1',
                        vin: 'VIN12345678901234',
                        plateNumber: 'ABC123',
                        countryCode: 'US',
                        insuranceDate: ['2023', '11', '10'],
                        lastInspectionDate: ['2023', '10', '01'],
                        nextInspectionDate: ['2024', '11', '01'],
                        productionDate: ['2022', '01', '01'],
                        driver: undefined,
                        locations: [],
                    },
                ],
                totalElements: 1,
            })
        );

        mockAuthService.isManager.and.returnValue(true);
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should fetch vehicles on init', () => {
        fixture.detectChanges();
        expect(mockVehiclesService.getAllVehicles).toHaveBeenCalledWith({
            pageNumber: 0,
            pageSize: 4,
        });
        expect(component.vehicles?.length).toBe(1);
    });

    it('should render vehicles when available', () => {
        fixture.detectChanges();
        const vehicleCards = fixture.debugElement.queryAll(
            By.css('app-vehicle-card')
        );
        expect(vehicleCards.length).toBe(1);
    });

    it('should render "no vehicles" message when vehicles are empty', () => {
        mockVehiclesService.getAllVehicles.and.returnValue(
            of({ content: [], totalElements: 0 })
        );
        fixture.detectChanges();
        const message = fixture.debugElement.query(By.css('h3')).nativeElement
            .textContent;
        expect(message).toContain("You don't have any vehicle in your fleet!");
    });

    it('should call paginator event handler', () => {
        fixture.detectChanges();
        const paginator = fixture.debugElement.query(
            By.directive(MatPaginator)
        );
        const paginatorComponent = paginator.componentInstance as MatPaginator;

        paginatorComponent.page.emit({ pageIndex: 1, pageSize: 9, length: 10 });
        expect(mockVehiclesService.getAllVehicles).toHaveBeenCalledWith({
            pageNumber: 1,
            pageSize: 9,
        });
    });

    it('should display "assigned vehicles" for drivers', () => {
        mockAuthService.isManager.and.returnValue(false);
        fixture.detectChanges();
        const message = fixture.debugElement.query(By.css('h3')).nativeElement
            .textContent;
        expect(message).toContain('Assigned vehicles:');
    });

    it('should check isDriver method correctly', () => {
        mockAuthService.isManager.and.returnValue(false);
        expect(component.isDriver()).toBeTrue();

        mockAuthService.isManager.and.returnValue(true);
        expect(component.isDriver()).toBeFalse();
    });
});

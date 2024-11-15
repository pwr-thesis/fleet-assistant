import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { managerRoleGuard } from './manager-role.guard';
import { AuthService } from '../../app/auth/service/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('managerRoleGuard', () => {
    let mockAuthService: jasmine.SpyObj<AuthService>;
    let mockRouter: jasmine.SpyObj<Router>;

    const mockRoute = {} as ActivatedRouteSnapshot;
    const mockState = {} as RouterStateSnapshot;

    beforeEach(() => {
        mockAuthService = jasmine.createSpyObj('AuthService', ['isManager']);
        mockRouter = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [
                { provide: AuthService, useValue: mockAuthService },
                { provide: Router, useValue: mockRouter },
            ],
        });
    });

    it('should allow navigation if the user is a manager', () => {
        mockAuthService.isManager.and.returnValue(true);

        const result = TestBed.runInInjectionContext(() =>
            managerRoleGuard(mockRoute, mockState)
        );

        expect(result).toBeTrue();
        expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should redirect to the home page if the user is not a manager', () => {
        mockAuthService.isManager.and.returnValue(false);

        const result = TestBed.runInInjectionContext(() =>
            managerRoleGuard(mockRoute, mockState)
        );

        expect(result).toBeFalse();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
    });
});

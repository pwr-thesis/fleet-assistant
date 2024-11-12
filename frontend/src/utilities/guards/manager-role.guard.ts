import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../app/auth/service/auth.service';

export const managerRoleGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isManager()) {
        return true;
    } else {
        router.navigate(['']);
        return false;
    }
};

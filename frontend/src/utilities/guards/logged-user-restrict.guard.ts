import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../app/auth/service/auth.service';

export const loggedUserRestrictGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isLoggedIn()) {
        router.navigate(['']);
        return false;
    } else {
        return true;
    }
};

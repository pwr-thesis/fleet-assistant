import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';
import { SnackbarService } from './services/snackbar.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem('accessToken');
    const router = inject(Router);
    const snackbarService = inject(SnackbarService);

    let authReq = req.clone();
    if (!req.url.includes('google')) {
        authReq = token
            ? req.clone({
                  setHeaders: {
                      Authorization: `Bearer ${token}`,
                  },
              })
            : req;
    }

    return next(authReq).pipe(
        catchError((error) => {
            if (error.status === 401) {
                localStorage.removeItem('userInfo');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('chatHistory');
                router.navigate(['']);
                snackbarService.openSnackBar('Your session was expired!');
            }
            return EMPTY;
        })
    );
};

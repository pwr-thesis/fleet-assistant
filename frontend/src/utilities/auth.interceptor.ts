import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem('accessToken');
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

    return next(authReq);
};

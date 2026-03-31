import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  filter,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { MessageService } from 'primeng/api';
import { LoginService } from '@shared/services/login.service';

// Modül seviyesinde tutulur; aynı anda sadece bir refresh isteği gider.
let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);
  const loginService = inject(LoginService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const isAuthEndpoint =
        req.url.includes('/auth/refresh') ||
        req.url.includes('/auth/logout') ||
        (req.url.includes('/login') && !req.url.includes('/login-info'));

      // 401/403 ve auth endpoint değilse refresh token akışını dene
      if ((error.status === 401 || error.status === 403) && !isAuthEndpoint) {
        const currentRefreshToken = loginService.currentUser()?.refreshToken;

        if (!currentRefreshToken) {
          loginService.forceLogout();
          return throwError(() => error);
        }

        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null);

          return loginService.refreshToken(currentRefreshToken).pipe(
            catchError((refreshError) => {
              // Invalid Token, expired refresh token vb. → zorla çıkış
              isRefreshing = false;
              refreshTokenSubject.next(null);
              loginService.forceLogout();
              return throwError(() => refreshError);
            }),
            switchMap((response) => {
              isRefreshing = false;
              const newAccessToken: string = response.efbToken;
              const newRefreshToken: string = response.refreshToken;

              loginService.updateTokens(newAccessToken, newRefreshToken);
              refreshTokenSubject.next(newAccessToken);

              // Orijinal isteği yeni token ile tekrarla
              return next(
                req.clone({
                  setHeaders: { authorization: `Bearer ${newAccessToken}` },
                }),
              );
            }),
          );
        }

        // Refresh devam ederken gelen diğer istekleri beklet
        return refreshTokenSubject.pipe(
          filter((token) => token !== null),
          take(1),
          switchMap((token) =>
            next(
              req.clone({ setHeaders: { authorization: `Bearer ${token}` } }),
            ),
          ),
        );
      }

      // Diğer tüm hatalar için mevcut toast davranışını koru
      if (req.method !== 'GET') {
        messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.error?.message,
        });
      }

      return throwError(() => error);
    }),
  );
};

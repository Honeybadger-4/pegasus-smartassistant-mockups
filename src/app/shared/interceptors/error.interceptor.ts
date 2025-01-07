import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { LoginService } from '@shared/services/login.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);
  const router = inject(Router);
  const loginService = inject(LoginService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.error.status === 401) {
        loginService.logout();
      }
      if (req.method !== 'GET') {
        // Hataların başlığı var ise summary alanıda servisten gelen bilgiye göre doldurulabilir.
        messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.error.message,
        });
      }

      return throwError(() => error);
    }),
  );
};

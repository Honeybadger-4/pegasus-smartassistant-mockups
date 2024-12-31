import { HttpInterceptorFn } from '@angular/common/http';
import { inject, signal } from '@angular/core';
import { LoadSheetService } from '@shared/services/load-sheet.service';
import { LoginService } from '@shared/services/login.service';

export const httpHeadersInterceptor: HttpInterceptorFn = (req, next) => {
  const loginService = inject(LoginService);

  const token = loginService.currentUser()?.efbToken;
  const header = signal<any>({});

  if (req.url.includes('/login') && !req.url.includes('/login-info')) {
    header.set({
      'Content-Type': 'application/json',
      Accept: '*/*',
      os: 'a',
      osVersion: '1',
      appVersion: '1',
      deviceBrand: 'a',
      deviceModel: 'a',
      deviceId: '1',
      ipAddress: '1',
    });
  } else {
    header.set({
      'Content-Type': 'application/json',
      Accept: '*/*',
      os: 'a',
      osVersion: '1',
      appVersion: '1',
      deviceBrand: 'a',
      deviceModel: 'a',
      deviceId: '1',
      ipAddress: '1',
      authorization: `Bearer ${token}`,
    });
  }

  const updatedRequest = req.clone({
    setHeaders: header(),
  });

  return next(updatedRequest);
};

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoginService } from '@shared/services/login.service';

export const httpHeadersInterceptor: HttpInterceptorFn = (req, next) => {
  const loginService = inject(LoginService);

  const token = loginService.currentUser()?.efbToken;

  const updatedRequest = req.clone({
    setHeaders: {
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
    },
  });

  return next(updatedRequest);
};

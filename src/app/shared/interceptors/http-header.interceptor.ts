import { HttpInterceptorFn } from '@angular/common/http';

export const httpHeadersInterceptor: HttpInterceptorFn = (req, next) => {
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
    },
  });

  return next(updatedRequest);
};

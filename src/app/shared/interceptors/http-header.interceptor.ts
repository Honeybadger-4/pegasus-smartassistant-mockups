import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoginService } from '@shared/services/login.service';
import { UAParser } from 'ua-parser-js';

export const httpHeadersInterceptor: HttpInterceptorFn = (req, next) => {
  const loginService = inject(LoginService);

  const token = loginService.currentUser()?.efbToken;

  const parser = new UAParser();
  const result = parser.getResult();
  const os = result.os.name || 'Unknown OS';
  const osVersion = result.os.version || 'Unknown Version';
  const deviceBrand = result.device.type || 'Unknown Brand';
  const deviceModel = result.device.model || 'Unknown Model';
  const deviceId = localStorage.getItem('deviceId') || '-';

  const headers: any = {
    'Content-Type': 'application/json',
    Accept: '*/*',
    os,
    osVersion,
    appVersion: '-',
    deviceBrand,
    deviceModel,
    deviceId,
    ipAddress: '-',
  };

  const noAuthEndpoint =
    (req.url.includes('/login') && !req.url.includes('/login-info')) ||
    req.url.includes('/auth/refresh');

  if (!noAuthEndpoint) {
    headers['authorization'] = `Bearer ${token}`;
  }

  const updatedRequest = req.clone({
    setHeaders: headers,
  });

  return next(updatedRequest);
};

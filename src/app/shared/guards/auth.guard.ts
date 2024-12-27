import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '@shared/services/login.service';

export const authGuard: CanActivateFn = (route, state) => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);
  const loginService = inject(LoginService);

  if (isPlatformBrowser(platformId)) {
    const isCanActivate = loginService.isAuthenticated();

    if (!isCanActivate) {
      router.navigate(['/login']);
      return false;
    }

    return true;
  }

  return true;
};

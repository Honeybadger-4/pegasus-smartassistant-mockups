import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '@shared/services/login.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const loginService = inject(LoginService);

  let isCanActive = loginService.isAuthenticated();

  if (!isCanActive) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};

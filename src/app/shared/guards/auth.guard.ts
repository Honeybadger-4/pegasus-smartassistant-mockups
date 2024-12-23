import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  // TODO: Login servisi bağlandıktan sonra isCanActive değişkeninin değeri default olarak false olacak. Login servisi isteği içerisinde true yapılacak.
  let isCanActive: boolean = true;

  if (!isCanActive) {
    router.navigate(['/login']);
  }

  return isCanActive;
};

/**
 * ROLE: Prevents authenticated users from visiting guest-only pages (login).
 * WHEN IT RUNS: Before activating auth layout routes (login, register).
 * WHAT IT DOES: Redirects to dashboard if already logged in; otherwise allows access.
 */

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { ROUTE_PATHS } from '../constants/routes.constant';
import { AuthService } from '../services/auth.service';

export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return router.createUrlTree([ROUTE_PATHS.dashboard]);
  }

  return true;
};

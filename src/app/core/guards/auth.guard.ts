/**
 * ROLE: Protects routes that require an authenticated user.
 * WHEN IT RUNS: Before activating routes with `canActivate: [authGuard]`.
 * WHAT IT DOES: Allows navigation if authenticated; otherwise redirects to login with returnUrl.
 */

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { ROUTE_PATHS } from '../constants/routes.constant';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const tokenService = inject(TokenService);
  const router = inject(Router);

  const hasUser = auth.isAuthenticated();
  const hasValidToken =
    !!tokenService.getAccessToken() && !tokenService.isTokenExpired();

  if (hasUser && hasValidToken) {
    return true;
  }

  return router.createUrlTree([ROUTE_PATHS.login], {
    queryParams: { returnUrl: state.url },
  });
};

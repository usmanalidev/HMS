/**
 * ROLE: Attaches Bearer access token to outgoing HTTP requests.
 * WHEN IT RUNS: Registered in app.config via provideHttpClient(withInterceptors(...)).
 * WHAT IT DOES: Clones requests with Authorization header; skips login/refresh endpoints.
 */

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { TokenService } from '../services/token.service';

const SKIP_PATHS = ['/auth/login', '/auth/refresh'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);

  const shouldSkip = SKIP_PATHS.some((path) => req.url.includes(path));
  if (shouldSkip) {
    return next(req);
  }

  const token = tokenService.getAccessToken();
  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authReq);
};

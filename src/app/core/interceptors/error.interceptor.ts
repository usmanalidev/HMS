/**
 * ROLE: Global HTTP error handling with token refresh and user toasts.
 * WHEN IT RUNS: After auth interceptor on failed responses (4xx/5xx).
 * WHAT IT DOES: On 401 tries refresh once then logout; shows toasts for 403/500.
 */

import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { LoggerService } from '../services/logger.service';
import { NotificationService } from '../services/notification.service';

let refreshInProgress = false;

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const notifications = inject(NotificationService);
  const logger = inject(LoggerService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/login')) {
        if (!refreshInProgress) {
          refreshInProgress = true;
          return auth.ensureValidToken().pipe(
            switchMap((ok) => {
              refreshInProgress = false;
              if (ok) {
                logger.log('Token refreshed — retrying request');
                return next(req);
              }
              notifications.error('Session expired', 'Please sign in again.');
              auth.logout();
              return throwError(() => error);
            }),
            catchError((refreshErr) => {
              refreshInProgress = false;
              auth.logout();
              return throwError(() => refreshErr);
            }),
          );
        }
        auth.logout();
        return throwError(() => error);
      }

      if (error.status === 403) {
        notifications.warning(
          'Access denied',
          'You do not have permission to perform this action.',
        );
      }

      if (error.status >= 500) {
        notifications.error(
          'Server error',
          'Something went wrong on our end. Please try again later.',
        );
        logger.error('HTTP 5xx', error.message, error.url);
      }

      return throwError(() => error);
    }),
  );
};

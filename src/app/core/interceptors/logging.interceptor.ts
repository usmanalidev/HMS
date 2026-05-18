/**
 * ROLE: Development-friendly HTTP request/response logging.
 * WHEN IT RUNS: Wraps every HttpClient call when registered in app.config.
 * WHAT IT DOES: Logs method, URL, status, and duration via LoggerService.
 */

import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { filter, tap } from 'rxjs';

import { LoggerService } from '../services/logger.service';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const logger = inject(LoggerService);
  const started = performance.now();

  logger.log(`→ ${req.method} ${req.urlWithParams}`);

  return next(req).pipe(
    tap({
      error: (err: unknown) => {
        const elapsed = Math.round(performance.now() - started);
        logger.error(`✗ ${req.method} ${req.urlWithParams} (${elapsed}ms)`, err);
      },
    }),
    filter((event): event is HttpResponse<unknown> => event instanceof HttpResponse),
    tap(() => {
      const elapsed = Math.round(performance.now() - started);
      logger.log(`← ${req.method} ${req.urlWithParams} (${elapsed}ms)`);
    }),
  );
};

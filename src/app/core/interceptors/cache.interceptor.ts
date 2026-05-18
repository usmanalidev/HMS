/**
 * ROLE: Optional GET response cache for demo endpoints (e.g. /reports).
 * WHEN IT RUNS: On GET requests before they hit the network.
 * WHAT IT DOES: Returns cached body from CacheService when valid; stores responses with TTL.
 */

import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { of, tap } from 'rxjs';

import { CacheService } from '../services/cache.service';

const CACHE_TTL_MS = 60_000;
const CACHEABLE_PATH = '/reports';

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  const cache = inject(CacheService);

  if (req.method !== 'GET' || !req.url.includes(CACHEABLE_PATH)) {
    return next(req);
  }

  const cacheKey = req.urlWithParams;
  const cached = cache.get<unknown>(cacheKey);
  if (cached !== null) {
    return of(new HttpResponse({ body: cached, status: 200, url: req.url }));
  }

  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse && event.body !== undefined) {
        cache.set(cacheKey, event.body, CACHE_TTL_MS);
      }
    }),
  );
};

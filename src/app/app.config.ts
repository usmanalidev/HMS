/**
 * ROLE: Root dependency injection configuration for the entire app.
 * WHEN IT RUNS: Once at bootstrapApplication(App, appConfig).
 * WHAT IT DOES: Registers router, HTTP client, interceptors, animations, and global tokens.
 */

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';

import { authInterceptor } from './core/interceptors/auth.interceptor';
import { cacheInterceptor } from './core/interceptors/cache.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { loggingInterceptor } from './core/interceptors/logging.interceptor';
import { AuthService } from './core/services/auth.service';
import { ROLE_CHECKER } from './shared/directives/has-role.directive';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([
        loggingInterceptor,
        authInterceptor,
        cacheInterceptor,
        errorInterceptor,
      ]),
    ),
    { provide: ROLE_CHECKER, useExisting: AuthService },
  ],
};

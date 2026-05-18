/**
 * ROLE: Centralized console logging with a consistent prefix.
 * WHEN IT RUNS: Injected anywhere (interceptors, services, components) for debug output.
 * WHAT IT DOES: Wraps console.log/warn/error with `[HMS]` prefix and optional context.
 */

import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  private readonly prefix = '[HMS]';

  /** General informational logs (development-friendly). */
  log(message: string, ...optionalParams: unknown[]): void {
    // Learning note: strip or gate logs in production via environment.production
    console.log(this.prefix, message, ...optionalParams);
  }

  /** Non-fatal issues worth surfacing during development. */
  warn(message: string, ...optionalParams: unknown[]): void {
    console.warn(this.prefix, message, ...optionalParams);
  }

  /** Errors that may need monitoring integration later. */
  error(message: string, ...optionalParams: unknown[]): void {
    console.error(this.prefix, message, ...optionalParams);
  }

  /** Group related logs (e.g. HTTP request lifecycle). */
  group(label: string, fn: () => void): void {
    console.group(`${this.prefix} ${label}`);
    try {
      fn();
    } finally {
      console.groupEnd();
    }
  }
}

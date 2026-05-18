/**
 * ROLE: Development runtime configuration for API and feature flags.
 * WHEN IT RUNS: Bundled by default (`ng serve`, development build); not swapped in production.
 * WHAT IT DOES: Exposes `apiUrl` pointing at local json-server/backend and `production: false`.
 */

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
} as const;

export type Environment = typeof environment;

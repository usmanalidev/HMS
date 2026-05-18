/**
 * ROLE: Production runtime configuration for API and feature flags.
 * WHEN IT RUNS: Replaces `environment.ts` when building with `--configuration production`.
 * WHAT IT DOES: Uses relative `/api` (reverse-proxy friendly) and sets `production: true`.
 */

export const environment = {
  production: true,
  apiUrl: '/api',
} as const;

export type Environment = typeof environment;

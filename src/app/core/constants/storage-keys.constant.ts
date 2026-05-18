/**
 * ROLE: Central registry of sessionStorage/localStorage key names.
 * WHEN IT RUNS: Referenced by TokenService, AuthService, and ThemeService on read/write.
 * WHAT IT DOES: Prevents typos and documents persisted client-side state keys.
 */

/** Keys used for auth and UI persistence in the browser. */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'hms_access_token',
  REFRESH_TOKEN: 'hms_refresh_token',
  THEME: 'hms_theme',
  USER: 'hms_user',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

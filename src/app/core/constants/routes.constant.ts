/**
 * ROLE: Single source of truth for application route path segments.
 * WHEN IT RUNS: Referenced by route config, guards, MenuService, and routerLink bindings.
 * WHAT IT DOES: Avoids magic strings and keeps navigation/refactors consistent.
 */

export const ROUTES = {
  ROOT: '',
  AUTH: 'auth',
  LOGIN: 'login',
  DASHBOARD: 'dashboard',
  PATIENTS: 'patients',
  PATIENT_DETAIL: 'patients/:id',
  APPOINTMENTS: 'appointments',
  REPORTS: 'reports',
  USERS: 'users',
  SETTINGS: 'settings',
  BILLING: 'billing',
  PROFILE: 'profile',
  NOT_FOUND: '**',
} as const;

/** Full path helpers for router.navigate and routerLink. */
export const ROUTE_PATHS = {
  login: `/${ROUTES.AUTH}/${ROUTES.LOGIN}`,
  dashboard: `/${ROUTES.DASHBOARD}`,
  patients: `/${ROUTES.PATIENTS}`,
  appointments: `/${ROUTES.APPOINTMENTS}`,
  reports: `/${ROUTES.REPORTS}`,
  users: `/${ROUTES.USERS}`,
  settings: `/${ROUTES.SETTINGS}`,
  billing: `/${ROUTES.BILLING}`,
  profile: `/${ROUTES.PROFILE}`,
} as const;

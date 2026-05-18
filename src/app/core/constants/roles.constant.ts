/**
 * ROLE: Role labels and permission map for RBAC checks.
 * WHEN IT RUNS: Used by AuthService.hasPermission, role guard, and MenuService filtering.
 * WHAT IT DOES: Maps each UserRole to allowed permission strings for fine-grained access.
 */

import { UserRole } from '../models/user.model';

/** Human-readable role labels for UI. */
export const ROLES: Record<UserRole, string> = {
  [UserRole.Admin]: 'Administrator',
  [UserRole.Doctor]: 'Doctor',
  [UserRole.Nurse]: 'Nurse',
  [UserRole.Receptionist]: 'Receptionist',
};

/** Permission strings used across routes and templates. */
export const PERMISSIONS = {
  PATIENTS_READ: 'patients:read',
  PATIENTS_WRITE: 'patients:write',
  APPOINTMENTS_READ: 'appointments:read',
  APPOINTMENTS_WRITE: 'appointments:write',
  REPORTS_READ: 'reports:read',
  USERS_MANAGE: 'users:manage',
  SETTINGS_MANAGE: 'settings:manage',
  BILLING_READ: 'billing:read',
  BILLING_WRITE: 'billing:write',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/**
 * Role → permissions matrix.
 * Learning note: guards check roles; components can check granular permissions.
 */
export const ROLE_PERMISSIONS: Record<UserRole, readonly Permission[]> = {
  [UserRole.Admin]: Object.values(PERMISSIONS),
  [UserRole.Doctor]: [
    PERMISSIONS.PATIENTS_READ,
    PERMISSIONS.PATIENTS_WRITE,
    PERMISSIONS.APPOINTMENTS_READ,
    PERMISSIONS.APPOINTMENTS_WRITE,
    PERMISSIONS.REPORTS_READ,
    PERMISSIONS.BILLING_READ,
  ],
  [UserRole.Nurse]: [
    PERMISSIONS.PATIENTS_READ,
    PERMISSIONS.PATIENTS_WRITE,
    PERMISSIONS.APPOINTMENTS_READ,
    PERMISSIONS.APPOINTMENTS_WRITE,
  ],
  [UserRole.Receptionist]: [
    PERMISSIONS.PATIENTS_READ,
    PERMISSIONS.PATIENTS_WRITE,
    PERMISSIONS.APPOINTMENTS_READ,
    PERMISSIONS.APPOINTMENTS_WRITE,
    PERMISSIONS.BILLING_READ,
    PERMISSIONS.BILLING_WRITE,
  ],
};

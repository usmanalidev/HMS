/**
 * ROLE: Domain model for authenticated staff users in the HMS.
 * WHEN IT RUNS: Imported wherever user identity, roles, or profile data is typed.
 * WHAT IT DOES: Defines `User` shape and `UserRole` enum for RBAC across the app.
 */

/** Staff roles supported by the healthcare management system. */
export enum UserRole {
  Admin = 'admin',
  Doctor = 'doctor',
  Nurse = 'nurse',
  Receptionist = 'receptionist',
}

/** Logged-in staff member returned from auth and stored in session. */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department?: string;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Convenience helper for display names in headers and menus. */
export function getUserDisplayName(user: User): string {
  return `${user.firstName} ${user.lastName}`.trim();
}

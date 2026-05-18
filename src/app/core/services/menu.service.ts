/**
 * ROLE: Role-filtered sidebar navigation builder.
 * WHEN IT RUNS: Called by MainLayoutComponent on init and when user role changes.
 * WHAT IT DOES: Returns MenuItem[] visible to the current user's role.
 */

import { Injectable, computed, inject } from '@angular/core';

import { ROUTE_PATHS } from '../constants/routes.constant';
import type { MenuItem } from '../models/menu.model';
import { UserRole } from '../models/user.model';
import { AuthService } from './auth.service';

const ALL_STAFF: UserRole[] = [
  UserRole.Admin,
  UserRole.Doctor,
  UserRole.Nurse,
  UserRole.Receptionist,
];

const CLINICAL: UserRole[] = [UserRole.Admin, UserRole.Doctor, UserRole.Nurse];

@Injectable({ providedIn: 'root' })
export class MenuService {
  private readonly auth = inject(AuthService);

  /** Master menu definition (filtered at runtime by role). */
  private readonly allMenuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'dashboard',
      route: ROUTE_PATHS.dashboard,
      roles: ALL_STAFF,
    },
    {
      id: 'patients',
      label: 'Patients',
      icon: 'personal_injury',
      route: ROUTE_PATHS.patients,
      roles: ALL_STAFF,
    },
    {
      id: 'appointments',
      label: 'Appointments',
      icon: 'event',
      route: ROUTE_PATHS.appointments,
      roles: ALL_STAFF,
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: 'assessment',
      route: ROUTE_PATHS.reports,
      roles: [...CLINICAL, UserRole.Receptionist],
    },
    {
      id: 'billing',
      label: 'Billing',
      icon: 'payments',
      route: ROUTE_PATHS.billing,
      roles: [UserRole.Admin, UserRole.Receptionist],
    },
    {
      id: 'users',
      label: 'User Management',
      icon: 'group',
      route: ROUTE_PATHS.users,
      roles: [UserRole.Admin],
      dividerAfter: true,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'settings',
      route: ROUTE_PATHS.settings,
      roles: [UserRole.Admin],
    },
  ];

  /** Reactive menu list for the signed-in user. */
  readonly menuItems = computed(() => {
    const user = this.auth.currentUser();
    if (!user) {
      return [] as MenuItem[];
    }
    return this.getMenuForRole(user.role);
  });

  getMenuForRole(role: UserRole): MenuItem[] {
    return this.allMenuItems.filter((item) => item.roles.includes(role));
  }

  getMenuItems(): MenuItem[] {
    const user = this.auth.currentUser();
    return user ? this.getMenuForRole(user.role) : [];
  }
}

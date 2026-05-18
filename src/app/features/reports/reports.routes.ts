import { Routes } from '@angular/router';

import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';
import { UserRole } from '../../core/models/user.model';

const REPORT_ROLES = [
  UserRole.Admin,
  UserRole.Doctor,
  UserRole.Nurse,
  UserRole.Receptionist,
];

export const REPORTS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard, roleGuard],
    data: { roles: REPORT_ROLES },
    loadComponent: () =>
      import('./reports.component').then((m) => m.ReportsComponent),
    title: 'Reports',
  },
];

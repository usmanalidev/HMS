/**
 * ROLE: Route-level role authorization using route `data.roles`.
 * WHEN IT RUNS: After authGuard on routes that declare `data: { roles: UserRole[] }`.
 * WHAT IT DOES: Allows access if user has one of the required roles; else redirects to dashboard.
 */

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { ROUTE_PATHS } from '../constants/routes.constant';
import { UserRole } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const notifications = inject(NotificationService);

  const requiredRoles = (route.data['roles'] as UserRole[] | undefined) ?? [];

  if (requiredRoles.length === 0) {
    return true;
  }

  if (auth.hasRole(requiredRoles)) {
    return true;
  }

  notifications.warning('Access denied', 'Your role cannot open this page.');
  return router.createUrlTree([ROUTE_PATHS.dashboard]);
};

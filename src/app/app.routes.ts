/**
 * ROLE: Application route tree — entry point for Angular Router.
 * WHEN IT RUNS: Parsed at bootstrap; guards/resolvers run on each navigation.
 * WHAT IT DOES: Lazy-loads features under layouts; separates public auth from secured app.
 */

import { Routes } from '@angular/router';

import { ROUTES } from './core/constants/routes.constant';
import { authGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: ROUTES.DASHBOARD },

  {
    path: ROUTES.AUTH,
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },

  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: ROUTES.DASHBOARD,
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then(
            (m) => m.DASHBOARD_ROUTES,
          ),
      },
      {
        path: ROUTES.PATIENTS,
        loadChildren: () =>
          import('./features/patients/patients.routes').then(
            (m) => m.PATIENTS_ROUTES,
          ),
      },
      {
        path: ROUTES.USERS,
        loadChildren: () =>
          import('./features/users/users.routes').then((m) => m.USERS_ROUTES),
      },
      {
        path: ROUTES.REPORTS,
        loadChildren: () =>
          import('./features/reports/reports.routes').then(
            (m) => m.REPORTS_ROUTES,
          ),
      },
      {
        path: ROUTES.SETTINGS,
        loadChildren: () =>
          import('./features/settings/settings.routes').then(
            (m) => m.SETTINGS_ROUTES,
          ),
      },
      {
        path: 'notifications',
        loadChildren: () =>
          import('./features/notifications/notifications.routes').then(
            (m) => m.NOTIFICATIONS_ROUTES,
          ),
      },
    ],
  },

  {
    path: ROUTES.NOT_FOUND,
    loadComponent: () =>
      import('./features/errors/not-found/not-found.component').then(
        (m) => m.NotFoundComponent,
      ),
    title: 'Page not found',
  },
];

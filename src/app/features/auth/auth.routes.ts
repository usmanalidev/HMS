import { Routes } from '@angular/router';

import { ROUTES } from '../../core/constants/routes.constant';
import { guestGuard } from '../../core/guards/guest.guard';
import { AuthLayoutComponent } from '../../layouts/auth-layout/auth-layout.component';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [guestGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: ROUTES.LOGIN },
      {
        path: ROUTES.LOGIN,
        loadComponent: () =>
          import('./login/login.component').then((m) => m.LoginComponent),
        title: 'Sign in',
      },
      {
        path: 'forbidden',
        loadComponent: () =>
          import('./forbidden/forbidden.component').then((m) => m.ForbiddenComponent),
        title: 'Access denied',
      },
    ],
  },
];

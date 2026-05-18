import { Routes } from '@angular/router';

import { authGuard } from '../../core/guards/auth.guard';

export const NOTIFICATIONS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./notifications.component').then((m) => m.NotificationsComponent),
    title: 'Notifications',
  },
];

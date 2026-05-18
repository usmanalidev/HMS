import { Routes } from '@angular/router';

import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';
import { UserRole } from '../../core/models/user.model';

export const SETTINGS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard, roleGuard],
    data: { roles: [UserRole.Admin] },
    loadComponent: () =>
      import('./settings-shell/settings-shell.component').then(
        (m) => m.SettingsShellComponent,
      ),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'profile' },
      {
        path: 'profile',
        loadComponent: () =>
          import('./profile/profile.component').then((m) => m.ProfileComponent),
        title: 'Profile settings',
      },
      {
        path: 'theme',
        loadComponent: () =>
          import('./theme/theme.component').then((m) => m.ThemeComponent),
        title: 'Theme settings',
      },
      {
        path: 'dynamic-form',
        loadComponent: () =>
          import('./dynamic-form/dynamic-form.component').then(
            (m) => m.DynamicFormComponent,
          ),
        title: 'Dynamic form',
      },
    ],
  },
];

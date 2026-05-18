import { Routes } from '@angular/router';

import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';
import { UserRole } from '../../core/models/user.model';
import { userDetailResolver } from './resolvers/user-detail.resolver';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard, roleGuard],
    data: { roles: [UserRole.Admin] },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./user-list/user-list.component').then((m) => m.UserListComponent),
        title: 'Users',
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./user-detail/user-detail.component').then((m) => m.UserDetailComponent),
        resolve: { user: userDetailResolver },
        title: 'User detail',
      },
    ],
  },
];

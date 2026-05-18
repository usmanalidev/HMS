import { Routes } from '@angular/router';

import { authGuard } from '../../core/guards/auth.guard';

export const PATIENTS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./patient-list/patient-list.component').then(
            (m) => m.PatientListComponent,
          ),
        title: 'Patients',
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./patient-form/patient-form.component').then(
            (m) => m.PatientFormComponent,
          ),
        title: 'Register patient',
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./patient-detail/patient-detail.component').then(
            (m) => m.PatientDetailComponent,
          ),
        title: 'Patient detail',
      },
      {
        path: ':id/edit',
        loadComponent: () =>
          import('./patient-form/patient-form.component').then(
            (m) => m.PatientFormComponent,
          ),
        title: 'Edit patient',
      },
    ],
  },
];

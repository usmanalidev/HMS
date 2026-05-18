/**

 * LEARNING: Read-only detail view; navigate to edit route for mutations.

 */



import { DatePipe } from '@angular/common';

import {

  ChangeDetectionStrategy,

  Component,

  inject,

  OnInit,

  signal,

} from '@angular/core';

import { ActivatedRoute, RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';

import { MatCardModule } from '@angular/material/card';

import { MatChipsModule } from '@angular/material/chips';



import { ROUTE_PATHS } from '../../../core/constants/routes.constant';


import { LoadingSkeletonComponent } from '../../../shared/components/loading-skeleton/loading-skeleton.component';

import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

import { PatientService, type PatientRecord } from '../services/patient.service';



@Component({

  selector: 'app-patient-detail',

  standalone: true,

  imports: [

    DatePipe,

    RouterLink,

    PageHeaderComponent,

    LoadingSkeletonComponent,

    MatCardModule,

    MatButtonModule,

    MatChipsModule,

  ],

  changeDetection: ChangeDetectionStrategy.OnPush,

  template: `

    @if (loading()) {

      <app-loading-skeleton [rows]="4" [columns]="2" />

    } @else if (patient(); as p) {

      <app-page-header

        [title]="patientName(p)"

        [subtitle]="'MRN ' + p.mrn"

        [breadcrumbs]="[

          { label: 'Patients', route: patientsPath },

          { label: patientName(p) },

        ]"

      >

        <a

          mat-flat-button

          color="primary"

          pageHeaderActions

          [routerLink]="[patientsPath, p.id, 'edit']"

        >

          Edit

        </a>

      </app-page-header>



      <mat-card class="detail-card">

        <mat-chip-set>

          <mat-chip>{{ p.status }}</mat-chip>

          @if (p.department) {

            <mat-chip>{{ p.department }}</mat-chip>

          }

        </mat-chip-set>



        <dl class="detail-grid">

          <div>

            <dt>Date of birth</dt>

            <dd>{{ p.dateOfBirth | date: 'mediumDate' }}</dd>

          </div>

          <div>

            <dt>Gender</dt>

            <dd>{{ p.gender }}</dd>

          </div>

          <div>

            <dt>Phone</dt>

            <dd>{{ p.phone }}</dd>

          </div>

          @if (p.lastVisit) {

            <div>

              <dt>Last visit</dt>

              <dd>{{ p.lastVisit | date: 'medium' }}</dd>

            </div>

          }

        </dl>

      </mat-card>

    }

  `,

  styles: [

    `

      .detail-card {

        padding: 1.25rem;

      }



      .detail-grid {

        display: grid;

        grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));

        gap: 1rem;

        margin-top: 1rem;

      }



      dt {

        font-size: 0.75rem;

        color: var(--mat-sys-on-surface-variant);

      }



      dd {

        margin: 0.25rem 0 0;

        font-weight: 500;

      }

    `,

  ],

})

export class PatientDetailComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);

  private readonly patientService = inject(PatientService);



  protected readonly patientsPath = ROUTE_PATHS.patients;

  protected patientName(p: PatientRecord): string {
    return `${p.firstName} ${p.lastName}`.trim();
  }

  protected readonly loading = signal(true);

  protected readonly patient = signal<PatientRecord | null>(null);



  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {

      return;

    }



    this.patientService.getPatientById(id).subscribe({

      next: (p) => {

        this.patient.set(p);

        this.loading.set(false);

      },

      error: () => this.loading.set(false),

    });

  }

}



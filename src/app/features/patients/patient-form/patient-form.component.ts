/**

 * LEARNING: Reactive forms with FormBuilder; same component handles create vs edit via route param.

 */



import {

  ChangeDetectionStrategy,

  Component,

  inject,

  OnInit,

  signal,

} from '@angular/core';

import {

  FormBuilder,

  ReactiveFormsModule,

  Validators,

} from '@angular/forms';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';

import { MatFormFieldModule } from '@angular/material/form-field';

import { MatInputModule } from '@angular/material/input';

import { MatSelectModule } from '@angular/material/select';



import { ROUTE_PATHS } from '../../../core/constants/routes.constant';
import type { Patient } from '../../../core/models/patient.model';

import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

import { PatientService } from '../services/patient.service';



@Component({

  selector: 'app-patient-form',

  standalone: true,

  imports: [

    ReactiveFormsModule,

    RouterLink,

    PageHeaderComponent,

    MatFormFieldModule,

    MatInputModule,

    MatSelectModule,

    MatButtonModule,

  ],

  changeDetection: ChangeDetectionStrategy.OnPush,

  template: `

    <app-page-header

      [title]="isEdit() ? 'Edit patient' : 'Register patient'"

      [breadcrumbs]="[

        { label: 'Patients', route: patientsPath },

        { label: isEdit() ? 'Edit' : 'New' },

      ]"

    />



    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="patient-form">

      <div class="form-row">

        <mat-form-field appearance="outline">

          <mat-label>First name</mat-label>

          <input matInput formControlName="firstName" />

        </mat-form-field>

        <mat-form-field appearance="outline">

          <mat-label>Last name</mat-label>

          <input matInput formControlName="lastName" />

        </mat-form-field>

      </div>



      <div class="form-row">

        <mat-form-field appearance="outline">

          <mat-label>MRN</mat-label>

          <input matInput formControlName="mrn" />

        </mat-form-field>

        <mat-form-field appearance="outline">

          <mat-label>Date of birth</mat-label>

          <input matInput type="date" formControlName="dateOfBirth" />

        </mat-form-field>

      </div>



      <div class="form-row">

        <mat-form-field appearance="outline">

          <mat-label>Gender</mat-label>

          <mat-select formControlName="gender">

            <mat-option value="male">Male</mat-option>

            <mat-option value="female">Female</mat-option>

            <mat-option value="other">Other</mat-option>

            <mat-option value="unknown">Unknown</mat-option>

          </mat-select>

        </mat-form-field>

        <mat-form-field appearance="outline">

          <mat-label>Phone</mat-label>

          <input matInput formControlName="phone" />

        </mat-form-field>

      </div>



      <div class="form-row">

        <mat-form-field appearance="outline">

          <mat-label>Department</mat-label>

          <mat-select formControlName="department">

            <mat-option value="Cardiology">Cardiology</mat-option>

            <mat-option value="ER">ER</mat-option>

            <mat-option value="Pediatrics">Pediatrics</mat-option>

          </mat-select>

        </mat-form-field>

        <mat-form-field appearance="outline">

          <mat-label>Status</mat-label>

          <mat-select formControlName="status">

            <mat-option value="admitted">Admitted</mat-option>

            <mat-option value="critical">Critical</mat-option>

            <mat-option value="outpatient">Outpatient</mat-option>

            <mat-option value="discharged">Discharged</mat-option>

            <mat-option value="scheduled">Scheduled</mat-option>

          </mat-select>

        </mat-form-field>

      </div>



      <div class="actions">

        <a mat-button [routerLink]="patientsPath">Cancel</a>

        <button mat-flat-button color="primary" type="submit" [disabled]="saving()">

          {{ isEdit() ? 'Save changes' : 'Create patient' }}

        </button>

      </div>

    </form>

  `,

  styles: [

    `

      .patient-form {

        display: flex;

        flex-direction: column;

        gap: 0.5rem;

        max-width: 40rem;

      }



      .form-row {

        display: grid;

        grid-template-columns: 1fr 1fr;

        gap: 1rem;

      }



      .actions {

        display: flex;

        gap: 0.5rem;

        margin-top: 1rem;

      }



      @media (max-width: 600px) {

        .form-row {

          grid-template-columns: 1fr;

        }

      }

    `,

  ],

})

export class PatientFormComponent implements OnInit {

  private readonly fb = inject(FormBuilder);

  private readonly patientService = inject(PatientService);

  private readonly route = inject(ActivatedRoute);

  private readonly router = inject(Router);



  protected readonly patientsPath = ROUTE_PATHS.patients;

  protected readonly isEdit = signal(false);

  protected readonly saving = signal(false);



  private patientId: string | null = null;



  readonly form = this.fb.nonNullable.group({

    firstName: ['', Validators.required],

    lastName: ['', Validators.required],

    mrn: ['', Validators.required],

    dateOfBirth: ['', Validators.required],

    gender: ['unknown' as Patient['gender'], Validators.required],

    phone: ['', Validators.required],

    department: ['Cardiology', Validators.required],

    status: ['outpatient', Validators.required],

  });



  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (id && id !== 'new') {

      this.isEdit.set(true);

      this.patientId = id;

      this.patientService.getPatientById(id).subscribe((patient) => {

        this.form.patchValue({

          firstName: patient.firstName,

          lastName: patient.lastName,

          mrn: patient.mrn,

          dateOfBirth: patient.dateOfBirth,

          gender: patient.gender,

          phone: patient.phone,

          department: patient.department ?? 'Cardiology',

          status: patient.status,

        });

      });

    }

  }



  protected onSubmit(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;

    }



    this.saving.set(true);

    const payload = this.form.getRawValue();



    const request$ =

      this.isEdit() && this.patientId

        ? this.patientService.updatePatient(this.patientId, payload)

        : this.patientService.createPatient(payload);



    request$.subscribe({

      next: (patient) => {

        void this.router.navigate([ROUTE_PATHS.patients, patient.id]);

      },

      complete: () => this.saving.set(false),

      error: () => this.saving.set(false),

    });

  }

}



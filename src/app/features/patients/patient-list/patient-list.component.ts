/**

 * LEARNING: Combine search + filter FormControls with debounceSearch for responsive tables.

 */



import {

  ChangeDetectionStrategy,

  Component,

  DestroyRef,

  inject,

  OnInit,

  signal,

} from '@angular/core';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';

import { MatFormFieldModule } from '@angular/material/form-field';

import { MatSelectModule } from '@angular/material/select';

import { RouterLink } from '@angular/router';

import { combineLatest, startWith, switchMap, tap } from 'rxjs';



import { ROUTE_PATHS } from '../../../core/constants/routes.constant';


import {

  DataTableComponent,

  type DataTableColumn,

} from '../../../shared/components/data-table/data-table.component';

import { LoadingSkeletonComponent } from '../../../shared/components/loading-skeleton/loading-skeleton.component';

import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

import { debounceSearch } from '../../../shared/utils/rxjs-operators';

import {

  PatientService,

  type PatientRecord,

} from '../services/patient.service';



type PatientRow = PatientRecord & Record<string, unknown>;



@Component({

  selector: 'app-patient-list',

  standalone: true,

  imports: [

    ReactiveFormsModule,

    RouterLink,

    PageHeaderComponent,

    DataTableComponent,

    LoadingSkeletonComponent,

    MatButtonModule,

    MatFormFieldModule,

    MatSelectModule,

  ],

  templateUrl: './patient-list.component.html',

  changeDetection: ChangeDetectionStrategy.OnPush,

})

export class PatientListComponent implements OnInit {

  private readonly patientService = inject(PatientService);

  private readonly destroyRef = inject(DestroyRef);



  protected readonly patientsPath = ROUTE_PATHS.patients;

  protected readonly searchControl = new FormControl('', { nonNullable: true });

  protected readonly statusControl = new FormControl('', { nonNullable: true });

  protected readonly departmentControl = new FormControl('', { nonNullable: true });



  protected readonly loading = signal(true);

  protected readonly patients = signal<PatientRow[]>([]);



  protected readonly statusOptions = [

    '',

    'admitted',

    'critical',

    'outpatient',

    'discharged',

    'scheduled',

  ];



  protected readonly departmentOptions = ['', 'Cardiology', 'ER', 'Pediatrics'];



  protected readonly columns: DataTableColumn<PatientRow>[] = [

    { key: 'mrn', label: 'MRN', sortable: true },

    {

      key: 'name',

      label: 'Patient',

      sortable: true,

      format: (row) => `${row['firstName']} ${row['lastName']}`.trim(),

    },

    { key: 'department', label: 'Department' },

    { key: 'status', label: 'Status', sortable: true },

    { key: 'phone', label: 'Phone' },

  ];



  ngOnInit(): void {

    combineLatest([

      this.searchControl.valueChanges.pipe(

        startWith(''),

        debounceSearch(300),

      ),

      this.statusControl.valueChanges.pipe(startWith('')),

      this.departmentControl.valueChanges.pipe(startWith('')),

    ])

      .pipe(

        tap(() => this.loading.set(true)),

        switchMap(([q, status, department]) =>

          this.patientService.getPatients({

            q,

            status: status || undefined,

            department: department || undefined,

          }),

        ),

        takeUntilDestroyed(this.destroyRef),

      )

      .subscribe({

        next: (rows) => {

          this.patients.set(rows as PatientRow[]);

          this.loading.set(false);

        },

        error: () => this.loading.set(false),

      });

  }

}



/**

 * ROLE: Patient CRUD against json-server /patients collection.

 * WHEN IT RUNS: Injected by patient list, form, and detail components.

 * WHAT IT DOES: Lists, reads, creates, updates patients via ApiService.getRaw.

 */



import { Injectable, inject } from '@angular/core';

import { Observable, map } from 'rxjs';



import { ApiService } from '../../../core/services/api.service';

import type { Patient } from '../../../core/models/patient.model';



/** Mock API row shape (json-server seed may omit some Patient fields). */

export interface PatientRecord {

  id: string;

  mrn: string;

  firstName: string;

  lastName: string;

  dateOfBirth: string;

  gender: Patient['gender'];

  phone: string;

  status: string;

  department?: string;

  lastVisit?: string;

  allergies?: string[];

}



export interface PatientQueryParams {

  q?: string;

  status?: string;

  department?: string;

}



@Injectable({ providedIn: 'root' })

export class PatientService {

  private readonly api = inject(ApiService);



  getPatients(params: PatientQueryParams = {}): Observable<PatientRecord[]> {

    return this.api.getRaw<PatientRecord[]>('/patients').pipe(

      map((patients) => this.applyFilters(patients, params)),

    );

  }



  getPatientById(id: string): Observable<PatientRecord> {

    return this.api.getRaw<PatientRecord>(`/patients/${id}`);

  }



  createPatient(patient: Omit<PatientRecord, 'id'>): Observable<PatientRecord> {

    return this.api.post<PatientRecord>('/patients', patient);

  }



  updatePatient(id: string, patient: Partial<PatientRecord>): Observable<PatientRecord> {

    return this.api.put<PatientRecord>(`/patients/${id}`, patient);

  }



  deletePatient(id: string): Observable<void> {

    return this.api.delete<void>(`/patients/${id}`);

  }



  private applyFilters(

    patients: PatientRecord[],

    params: PatientQueryParams,

  ): PatientRecord[] {

    let result = [...patients];

    const q = params.q?.trim().toLowerCase();



    if (q) {

      result = result.filter((p) => {

        const haystack = [p.firstName, p.lastName, p.mrn, p.phone, p.department]

          .filter(Boolean)

          .join(' ')

          .toLowerCase();

        return haystack.includes(q);

      });

    }



    if (params.status) {

      result = result.filter((p) => p.status === params.status);

    }



    if (params.department) {

      result = result.filter((p) => p.department === params.department);

    }



    return result;

  }

}



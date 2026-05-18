/**
 * ROLE: Aggregates dashboard KPIs from mock API collections.
 * WHEN IT RUNS: Injected by DashboardComponent on init.
 * WHAT IT DOES: Counts /patients and /appointments via forkJoin + getRaw.
 */

import { Injectable, inject } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';

import { ApiService } from '../../../core/services/api.service';

export interface DashboardStats {
  patientCount: number;
  appointmentCount: number;
  criticalPatients: number;
  todayAppointments: number;
}

export interface RecentActivityItem {
  id: string;
  label: string;
  timestamp: string;
  icon: string;
}

interface MockPatientRow {
  id: string;
  firstName: string;
  lastName: string;
  status?: string;
  lastVisit?: string;
}

interface MockAppointmentRow {
  id: string;
  scheduledAt: string;
  status: string;
  department: string;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly api = inject(ApiService);

  getStats(): Observable<DashboardStats> {
    return forkJoin({
      patients: this.api.getRaw<MockPatientRow[]>('/patients'),
      appointments: this.api.getRaw<MockAppointmentRow[]>('/appointments'),
    }).pipe(
      map(({ patients, appointments }) => {
        const today = new Date().toISOString().slice(0, 10);
        return {
          patientCount: patients.length,
          appointmentCount: appointments.length,
          criticalPatients: patients.filter((p) => p.status === 'critical').length,
          todayAppointments: appointments.filter((a) =>
            a.scheduledAt.startsWith(today),
          ).length,
        };
      }),
    );
  }

  getRecentActivity(): Observable<RecentActivityItem[]> {
    return this.api.getRaw<MockAppointmentRow[]>('/appointments').pipe(
      map((appointments) =>
        [...appointments]
          .sort(
            (a, b) =>
              new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime(),
          )
          .slice(0, 5)
          .map((apt) => ({
            id: apt.id,
            label: `${apt.department} — ${apt.status}`,
            timestamp: apt.scheduledAt,
            icon: 'event',
          })),
      ),
    );
  }
}

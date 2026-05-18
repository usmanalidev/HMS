/**
 * ROLE: Domain model for patient records in the healthcare system.
 * WHEN IT RUNS: Used by patient modules, dashboards, and appointment flows.
 * WHAT IT DOES: Defines Patient demographics, contact, and clinical metadata.
 */

/** Patient record managed by reception, nurses, and doctors. */
export interface Patient {
  id: string;
  mrn: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other' | 'unknown';
  email?: string;
  phone: string;
  address?: PatientAddress;
  bloodType?: string;
  allergies: string[];
  emergencyContact?: EmergencyContact;
  primaryPhysicianId?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  status: PatientStatus;
  registeredAt: string;
  updatedAt: string;
}

export type PatientStatus = 'active' | 'inactive' | 'deceased' | 'transferred';

export interface PatientAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

/** Display name for patient lists and headers. */
export function getPatientDisplayName(patient: Patient): string {
  return `${patient.firstName} ${patient.lastName}`.trim();
}

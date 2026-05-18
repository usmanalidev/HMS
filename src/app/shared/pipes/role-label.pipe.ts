import { Pipe, PipeTransform } from '@angular/core';

/**
 * LEARNING: Map internal codes (API / auth roles) to user-friendly labels in one place.
 *
 * Centralizing display strings avoids scattering magic strings across templates and
 * makes localization easier later (swap this map for i18n keys).
 *
 * Usage:
 *   {{ currentUser.role | roleLabel }}
 */
export type AppRole = 'admin' | 'doctor' | 'nurse' | 'receptionist' | 'patient';

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrator',
  doctor: 'Doctor',
  nurse: 'Nurse',
  receptionist: 'Receptionist',
  patient: 'Patient',
};

@Pipe({
  name: 'roleLabel',
  standalone: true,
  pure: true,
})
export class RoleLabelPipe implements PipeTransform {
  transform(role: string | null | undefined, fallback = 'Unknown role'): string {
    if (!role) {
      return fallback;
    }
    return ROLE_LABELS[role.toLowerCase()] ?? this.toTitleCase(role);
  }

  private toTitleCase(value: string): string {
    return value
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }
}

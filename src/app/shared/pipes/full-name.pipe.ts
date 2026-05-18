import { Pipe, PipeTransform } from '@angular/core';

/**
 * LEARNING: Pipes transform displayed values in templates without changing the source data.
 *
 * Pure pipes (default) re-run only when their input reference changes — great for performance.
 * Impure pipes re-run on every change detection cycle; use sparingly.
 *
 * Usage in templates:
 *   {{ user | fullName }}
 *   {{ user | fullName:'last-first' }}
 *
 * Import standalone pipes in the `imports` array of any standalone component.
 */
export type FullNameOrder = 'first-last' | 'last-first';

export interface FullNameInput {
  firstName?: string | null;
  lastName?: string | null;
  middleName?: string | null;
}

@Pipe({
  name: 'fullName',
  standalone: true,
  pure: true,
})
export class FullNamePipe implements PipeTransform {
  transform(
    value: FullNameInput | string | null | undefined,
    order: FullNameOrder = 'first-last',
    separator = ' ',
  ): string {
    if (value == null) {
      return '';
    }

    if (typeof value === 'string') {
      return value.trim();
    }

    const parts = [value.firstName, value.middleName, value.lastName]
      .map((part) => part?.trim())
      .filter((part): part is string => Boolean(part));

    if (parts.length === 0) {
      return '';
    }

    if (order === 'last-first' && value.lastName) {
      const first = [value.firstName, value.middleName]
        .filter(Boolean)
        .join(separator)
        .trim();
      return first ? `${value.lastName}${separator}${first}` : value.lastName;
    }

    return parts.join(separator);
  }
}

import { Pipe, PipeTransform } from '@angular/core';

/**
 * LEARNING: Display pipes format data for humans (dates, currency, etc.).
 *
 * This pipe converts a Date or ISO string into relative text such as "5 minutes ago".
 * For live-updating labels, pair with AsyncPipe + an interval observable in the component,
 * or mark the pipe impure (not recommended for lists).
 *
 * Usage:
 *   {{ appointment.scheduledAt | timeAgo }}
 */
@Pipe({
  name: 'timeAgo',
  standalone: true,
  pure: true,
})
export class TimeAgoPipe implements PipeTransform {
  private readonly units: { limit: number; divisor: number; label: string }[] = [
    { limit: 60, divisor: 1, label: 'second' },
    { limit: 3600, divisor: 60, label: 'minute' },
    { limit: 86400, divisor: 3600, label: 'hour' },
    { limit: 604800, divisor: 86400, label: 'day' },
    { limit: 2629800, divisor: 604800, label: 'week' },
    { limit: 31557600, divisor: 2629800, label: 'month' },
    { limit: Number.POSITIVE_INFINITY, divisor: 31557600, label: 'year' },
  ];

  transform(value: Date | string | number | null | undefined): string {
    const date = this.toDate(value);
    if (!date) {
      return '';
    }

    const seconds = Math.round((Date.now() - date.getTime()) / 1000);
    if (seconds < 5) {
      return 'just now';
    }

    const absSeconds = Math.abs(seconds);
    const suffix = seconds < 0 ? 'from now' : 'ago';

    for (const unit of this.units) {
      if (absSeconds < unit.limit) {
        const count = Math.floor(absSeconds / unit.divisor);
        const label = count === 1 ? unit.label : `${unit.label}s`;
        return `${count} ${label} ${suffix}`;
      }
    }

    return date.toLocaleDateString();
  }

  private toDate(value: Date | string | number | null | undefined): Date | null {
    if (value == null || value === '') {
      return null;
    }
    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
}

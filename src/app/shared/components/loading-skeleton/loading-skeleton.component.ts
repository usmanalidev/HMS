import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * LEARNING: Skeleton screens reduce perceived load time by showing layout placeholders
 * before real data arrives — better UX than a blank page or spinner alone.
 *
 * Use while Observables resolve:
 *   @if (loading()) { <app-loading-skeleton [rows]="6" /> }
 *   @else { <app-data-table ... /> }
 */
@Component({
  selector: 'app-loading-skeleton',
  standalone: true,
  templateUrl: './loading-skeleton.component.html',
  styleUrl: './loading-skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingSkeletonComponent {
  /** Number of placeholder rows to render. */
  @Input() rows = 5;

  /** Number of columns per row (for table-like layouts). */
  @Input() columns = 4;

  /** When true, renders a circular avatar placeholder on the first column. */
  @Input() showAvatar = false;

  protected rowIndices(): number[] {
    return Array.from({ length: Math.max(1, this.rows) }, (_, index) => index);
  }

  protected columnIndices(): number[] {
    return Array.from({ length: Math.max(1, this.columns) }, (_, index) => index);
  }
}

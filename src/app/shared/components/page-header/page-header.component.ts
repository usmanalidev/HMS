import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * LEARNING: Content projection with ng-content lets parents inject action buttons
 * without the header knowing about every possible action.
 *
 * Named slots (`select="[pageHeaderActions]"`) keep markup organized:
 *   <app-page-header title="Patients">
 *     <button pageHeaderActions mat-flat-button>New</button>
 *   </app-page-header>
 */
export interface PageHeaderBreadcrumb {
  label: string;
  route?: string | string[];
}

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeaderComponent {
  @Input({ required: true }) title = '';
  @Input() subtitle?: string;
  @Input() breadcrumbs: PageHeaderBreadcrumb[] = [];
}

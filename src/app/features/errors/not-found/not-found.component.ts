/**
 * LEARNING: Wildcard route (**) renders this component for unknown URLs.
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ROUTE_PATHS } from '../../../core/constants/routes.constant';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="not-found">
      <mat-icon class="icon">search_off</mat-icon>
      <h1>404 — Page not found</h1>
      <p>The page you requested does not exist in this application.</p>
      <a mat-flat-button color="primary" [routerLink]="dashboardPath">Go to dashboard</a>
    </section>
  `,
  styles: [
    `
      .not-found {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.75rem;
        padding: 4rem 1rem;
        text-align: center;
      }

      .icon {
        font-size: 4rem;
        width: 4rem;
        height: 4rem;
        opacity: 0.7;
      }

      h1 {
        margin: 0;
      }

      p {
        margin: 0;
        color: var(--mat-sys-on-surface-variant);
      }
    `,
  ],
})
export class NotFoundComponent {
  protected readonly dashboardPath = ROUTE_PATHS.dashboard;
}

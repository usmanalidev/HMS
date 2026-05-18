/**

 * LEARNING: Dedicated error routes (403/404) improve UX vs generic redirects.

 * Shown when roleGuard or manual navigation blocks access.

 */



import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';

import { MatIconModule } from '@angular/material/icon';



import { ROUTE_PATHS } from '../../../core/constants/routes.constant';



@Component({

  selector: 'app-forbidden',

  standalone: true,

  imports: [RouterLink, MatButtonModule, MatIconModule],

  changeDetection: ChangeDetectionStrategy.OnPush,

  template: `

    <section class="forbidden" role="alert">

      <mat-icon class="forbidden-icon" color="warn">block</mat-icon>

      <h1>403 — Access denied</h1>

      <p>Your account does not have permission to view this resource.</p>

      <a mat-flat-button color="primary" [routerLink]="dashboardPath">Back to dashboard</a>

      <a mat-button [routerLink]="loginPath">Sign in as another user</a>

    </section>

  `,

  styles: [

    `

      .forbidden {

        display: flex;

        flex-direction: column;

        align-items: center;

        gap: 0.75rem;

        padding: 3rem 1rem;

        text-align: center;

      }



      .forbidden-icon {

        font-size: 4rem;

        width: 4rem;

        height: 4rem;

      }



      h1 {

        margin: 0;

        font-size: 1.5rem;

      }



      p {

        margin: 0;

        max-width: 28rem;

        color: var(--mat-sys-on-surface-variant);

      }

    `,

  ],

})

export class ForbiddenComponent {

  protected readonly dashboardPath = ROUTE_PATHS.dashboard;

  protected readonly loginPath = ROUTE_PATHS.login;

}



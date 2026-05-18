/**

 * LEARNING: Route resolvers prefetch data before activation — no empty-state flicker.

 * ActivatedRoute.data['user'] is typed from the resolver return value.

 */



import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ActivatedRoute, RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';

import { MatCardModule } from '@angular/material/card';

import { MatChipsModule } from '@angular/material/chips';

import { MatIconModule } from '@angular/material/icon';



import { ROLES } from '../../../core/constants/roles.constant';

import { ROUTE_PATHS } from '../../../core/constants/routes.constant';

import type { User } from '../../../core/models/user.model';

import { getUserDisplayName } from '../../../core/models/user.model';

import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';



@Component({

  selector: 'app-user-detail',

  standalone: true,

  imports: [
    DatePipe,
    RouterLink,
    PageHeaderComponent,

    MatCardModule,

    MatButtonModule,

    MatChipsModule,

    MatIconModule,

  ],

  changeDetection: ChangeDetectionStrategy.OnPush,

  template: `

    <app-page-header

      [title]="displayName()"

      [subtitle]="user.email"

      [breadcrumbs]="[

        { label: 'Users', route: usersPath },

        { label: displayName() },

      ]"

    >

      <a mat-stroked-button pageHeaderActions [routerLink]="usersPath">Back to list</a>

    </app-page-header>



    <mat-card class="user-detail-card">

      <mat-chip-set>

        <mat-chip highlighted>{{ roleLabel() }}</mat-chip>

        <mat-chip [class.inactive]="!user.isActive">

          {{ user.isActive ? 'Active' : 'Inactive' }}

        </mat-chip>

      </mat-chip-set>



      <dl class="detail-grid">

        <div>

          <dt>Department</dt>

          <dd>{{ user.department ?? '—' }}</dd>

        </div>

        <div>

          <dt>User ID</dt>

          <dd>{{ user.id }}</dd>

        </div>

        <div>

          <dt>Created</dt>

          <dd>{{ user.createdAt | date: 'mediumDate' }}</dd>

        </div>

      </dl>

    </mat-card>

  `,

  styles: [

    `

      .user-detail-card {

        padding: 1.25rem;

      }



      .detail-grid {

        display: grid;

        grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));

        gap: 1rem;

        margin: 1rem 0 0;

      }



      dt {

        font-size: 0.75rem;

        color: var(--mat-sys-on-surface-variant);

      }



      dd {

        margin: 0.25rem 0 0;

        font-weight: 500;

      }



      .inactive {

        opacity: 0.7;

      }

    `,

  ],

})

export class UserDetailComponent {

  private readonly route = inject(ActivatedRoute);



  protected readonly usersPath = ROUTE_PATHS.users;

  protected readonly user = this.route.snapshot.data['user'] as User;



  protected displayName(): string {

    return getUserDisplayName(this.user);

  }



  protected roleLabel(): string {

    return ROLES[this.user.role];

  }

}



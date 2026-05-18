/**

 * LEARNING: cacheInterceptor caches GET /reports for 60s — reload to see network vs cache.

 * Check DevTools Network tab: second load within TTL may not hit the server.

 */



import {

  ChangeDetectionStrategy,

  Component,

  inject,

  OnInit,

  signal,

} from '@angular/core';

import { MatButtonModule } from '@angular/material/button';

import { MatCardModule } from '@angular/material/card';

import { MatIconModule } from '@angular/material/icon';

import { MatListModule } from '@angular/material/list';

import { DatePipe, UpperCasePipe } from '@angular/common';



import { ApiService } from '../../core/services/api.service';

import { CacheService } from '../../core/services/cache.service';

import { LearningBannerComponent } from '../../shared/components/learning-banner/learning-banner.component';

import { LoadingSkeletonComponent } from '../../shared/components/loading-skeleton/loading-skeleton.component';

import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';



export interface ReportRecord {

  id: string;

  title: string;

  department: string;

  generatedBy: string;

  generatedAt: string;

  format: string;

  summary: string;

}



@Component({

  selector: 'app-reports',

  standalone: true,

  imports: [

    DatePipe,
    UpperCasePipe,

    PageHeaderComponent,

    LearningBannerComponent,

    LoadingSkeletonComponent,

    MatCardModule,

    MatListModule,

    MatButtonModule,

    MatIconModule,

  ],

  changeDetection: ChangeDetectionStrategy.OnPush,

  template: `

    <app-page-header title="Reports" subtitle="Operational and compliance exports" />



    <app-learning-banner

      [topics]="[

        'HTTP cacheInterceptor on GET /reports',

        'CacheService TTL (60 seconds)',

        'Force refresh clears cache key',

      ]"

    />



    <div class="toolbar">

      <button mat-stroked-button type="button" (click)="refresh(true)">

        <mat-icon>refresh</mat-icon>

        Force refresh (bypass cache)

      </button>

      @if (loadedAt()) {

        <span class="meta">Last loaded: {{ loadedAt() | date: 'mediumTime' }}</span>

      }

    </div>



    @if (loading()) {

      <app-loading-skeleton [rows]="3" [columns]="1" />

    } @else {

      <mat-card>

        <mat-nav-list>

          @for (report of reports(); track report.id) {

            <a mat-list-item>

              <mat-icon matListItemIcon>description</mat-icon>

              <span matListItemTitle>{{ report.title }}</span>

              <span matListItemLine>

                {{ report.department }} · {{ report.format | uppercase }} —

                {{ report.summary }}

              </span>

              <span matListItemMeta>{{ report.generatedAt | date: 'short' }}</span>

            </a>

          }

        </mat-nav-list>

      </mat-card>

    }

  `,

  styles: [

    `

      .toolbar {

        display: flex;

        align-items: center;

        gap: 1rem;

        margin: 1rem 0;

      }



      .meta {

        font-size: 0.8125rem;

        color: var(--mat-sys-on-surface-variant);

      }

    `,

  ],

})

export class ReportsComponent implements OnInit {

  private readonly api = inject(ApiService);

  private readonly cache = inject(CacheService);



  protected readonly loading = signal(true);

  protected readonly reports = signal<ReportRecord[]>([]);

  protected readonly loadedAt = signal<Date | null>(null);



  ngOnInit(): void {

    this.refresh(false);

  }



  protected refresh(clearCache: boolean): void {

    if (clearCache) {

      this.cache.clear();

    }

    this.loading.set(true);

    this.api.getRaw<ReportRecord[]>('/reports').subscribe({

      next: (data) => {

        this.reports.set(data);

        this.loadedAt.set(new Date());

        this.loading.set(false);

      },

      error: () => this.loading.set(false),

    });

  }

}



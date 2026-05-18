/**
 * LEARNING: Smart containers load data in ngOnInit/effects; presentational children stay dumb.
 * OnPush + signals/async pipe minimize change detection on busy clinical dashboards.
 */

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { LearningBannerComponent } from '../../shared/components/learning-banner/learning-banner.component';
import { LoadingSkeletonComponent } from '../../shared/components/loading-skeleton/loading-skeleton.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';
import { AuthState } from '../../state/auth.state';
import {
  DashboardService,
  type DashboardStats,
  type RecentActivityItem,
} from './services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    PageHeaderComponent,
    LearningBannerComponent,
    LoadingSkeletonComponent,
    MatCardModule,
    MatIconModule,
    MatListModule,
    TimeAgoPipe,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  protected readonly authState = inject(AuthState);

  protected readonly loading = signal(true);
  protected readonly stats = signal<DashboardStats | null>(null);
  protected readonly activity = signal<RecentActivityItem[]>([]);

  protected readonly learningTopics = [
    'Angular signals for local UI state',
    'forkJoin to parallelize HTTP calls',
    'OnPush change detection strategy',
    'Standalone components and lazy routes',
  ];

  ngOnInit(): void {
    this.dashboardService.getStats().subscribe({
      next: (stats) => this.stats.set(stats),
      complete: () => this.loading.set(false),
    });

    this.dashboardService.getRecentActivity().subscribe({
      next: (items) => this.activity.set(items),
    });
  }
}

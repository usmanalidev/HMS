/**

 * LEARNING: Feature components fetch domain data; layout NotificationService is for toasts.

 * This screen lists inbox items from GET /notifications (json-server).

 */



import {

  ChangeDetectionStrategy,

  Component,

  inject,

  OnInit,

  signal,

} from '@angular/core';

import { MatCardModule } from '@angular/material/card';

import { MatChipsModule } from '@angular/material/chips';

import { MatIconModule } from '@angular/material/icon';

import { MatListModule } from '@angular/material/list';




import { ApiService } from '../../core/services/api.service';

import { LearningBannerComponent } from '../../shared/components/learning-banner/learning-banner.component';

import { LoadingSkeletonComponent } from '../../shared/components/loading-skeleton/loading-skeleton.component';

import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';



export interface InboxNotification {

  id: string;

  userId: string;

  title: string;

  message: string;

  type: string;

  read: boolean;

  createdAt: string;

}



@Component({

  selector: 'app-notifications',

  standalone: true,

  imports: [
    PageHeaderComponent,

    LearningBannerComponent,

    LoadingSkeletonComponent,

    MatCardModule,

    MatListModule,

    MatIconModule,

    MatChipsModule,

    TimeAgoPipe,

  ],

  changeDetection: ChangeDetectionStrategy.OnPush,

  template: `

    <app-page-header title="Notifications" subtitle="Inbox from /notifications API" />



    <app-learning-banner

      [topics]="[

        'HttpClient GET with ApiService.getRaw',

        'Different from layout toast NotificationService',

        'Material list with read/unread chips',

      ]"

    />



    @if (loading()) {

      <app-loading-skeleton [rows]="5" [columns]="1" />

    } @else {

      <mat-card>

        <mat-nav-list>

          @for (item of items(); track item.id) {

            <a mat-list-item [class.unread]="!item.read">

              <mat-icon matListItemIcon>{{ iconFor(item.type) }}</mat-icon>

              <span matListItemTitle>{{ item.title }}</span>

              <span matListItemLine>{{ item.message }}</span>

              <mat-chip matListItemMeta [disabled]="item.read">

                {{ item.read ? 'Read' : 'Unread' }}

              </mat-chip>

              <span matListItemMeta class="time">{{ item.createdAt | timeAgo }}</span>

            </a>

          } @empty {

            <p class="empty">No notifications.</p>

          }

        </mat-nav-list>

      </mat-card>

    }

  `,

  styles: [

    `

      .unread {

        font-weight: 600;

      }



      .time {

        font-size: 0.75rem;

        margin-left: 0.5rem;

      }



      .empty {

        padding: 1rem;

        margin: 0;

      }

    `,

  ],

})

export class NotificationsComponent implements OnInit {

  private readonly api = inject(ApiService);



  protected readonly loading = signal(true);

  protected readonly items = signal<InboxNotification[]>([]);



  ngOnInit(): void {

    this.api.getRaw<InboxNotification[]>('/notifications').subscribe({

      next: (data) => {

        this.items.set(data);

        this.loading.set(false);

      },

      error: () => this.loading.set(false),

    });

  }



  protected iconFor(type: string): string {

    switch (type) {

      case 'alert':

        return 'notification_important';

      case 'warning':

        return 'warning';

      default:

        return 'info';

    }

  }

}



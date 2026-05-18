/**
 * ROLE: Authenticated app shell with sidebar, header, and content area.
 * WHEN IT RUNS: Parent route for all secured feature routes after login.
 * WHAT IT DOES: Renders role-based menu, breadcrumbs, theme toggle, notifications, and outlet.
 */

import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ROLES } from '../../core/constants/roles.constant';
import { ROUTE_PATHS } from '../../core/constants/routes.constant';
import { getUserDisplayName } from '../../core/models/user.model';
import { AuthService } from '../../core/services/auth.service';
import { MenuService } from '../../core/services/menu.service';
import { NotificationService } from '../../core/services/notification.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatDividerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-sidenav-container class="layout-container">
      <mat-sidenav
        mode="side"
        [opened]="sidenavOpen()"
        class="app-sidenav"
      >
        <div class="sidenav-header">
          <mat-icon color="primary">local_hospital</mat-icon>
          <span>HMS Portal</span>
        </div>
        <mat-nav-list>
          @for (item of menuItems(); track item.id) {
            <a
              mat-list-item
              [routerLink]="item.route"
              routerLinkActive="active-link"
              [matTooltip]="item.label"
            >
              <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
              <span matListItemTitle>{{ item.label }}</span>
              @if (item.badge) {
                <span matListItemMeta class="menu-badge">{{ item.badge }}</span>
              }
            </a>
            @if (item.dividerAfter) {
              <mat-divider />
            }
          }
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar color="primary" class="app-toolbar">
          <button
            mat-icon-button
            type="button"
            (click)="toggleSidenav()"
            aria-label="Toggle navigation"
          >
            <mat-icon>menu</mat-icon>
          </button>

          <nav class="breadcrumbs" aria-label="Breadcrumb">
            @for (crumb of breadcrumbs(); track crumb.label; let last = $last) {
              @if (!last) {
                <a [routerLink]="crumb.url">{{ crumb.label }}</a>
                <mat-icon class="crumb-sep">chevron_right</mat-icon>
              } @else {
                <span>{{ crumb.label }}</span>
              }
            }
          </nav>

          <span class="toolbar-spacer"></span>

          <mat-slide-toggle
            [checked]="themeService.isDark()"
            (change)="onThemeToggle($event.checked)"
            matTooltip="Toggle light/dark theme"
          />

          <button
            mat-icon-button
            type="button"
            [matMenuTriggerFor]="notifMenu"
            aria-label="Notifications"
          >
            <mat-icon
              [matBadge]="notificationCount()"
              [matBadgeHidden]="notificationCount() === 0"
              matBadgeColor="warn"
            >
              notifications
            </mat-icon>
          </button>
          <mat-menu #notifMenu="matMenu" class="notif-menu">
            @if (notifications().length === 0) {
              <button mat-menu-item disabled>No notifications</button>
            } @else {
              @for (n of notifications(); track n.id) {
                <button mat-menu-item (click)="dismissNotification(n.id)">
                  <mat-icon>{{ iconForType(n.type) }}</mat-icon>
                  <span>{{ n.title }}: {{ n.message }}</span>
                </button>
              }
            }
          </mat-menu>

          <button
            mat-button
            type="button"
            [matMenuTriggerFor]="userMenu"
            class="user-menu-trigger"
          >
            <mat-icon>account_circle</mat-icon>
            {{ userDisplayName() }}
          </button>
          <mat-menu #userMenu="matMenu">
            <button mat-menu-item disabled>
              {{ roleLabel() }}
            </button>
            <mat-divider />
            <a mat-menu-item [routerLink]="profilePath">Profile</a>
            <button mat-menu-item type="button" (click)="logout()">Sign out</button>
          </mat-menu>
        </mat-toolbar>

        <main class="page-content">
          <router-outlet />
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [
    `
      .layout-container {
        height: 100vh;
      }

      .app-sidenav {
        width: 260px;
      }

      .sidenav-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 1rem;
        font-weight: 600;
      }

      .app-toolbar {
        position: sticky;
        top: 0;
        z-index: 2;
      }

      .toolbar-spacer {
        flex: 1;
      }

      .breadcrumbs {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        margin-left: 0.5rem;
        font-size: 0.875rem;
      }

      .breadcrumbs a {
        color: inherit;
        text-decoration: none;
        opacity: 0.9;
      }

      .crumb-sep {
        font-size: 1rem;
        width: 1rem;
        height: 1rem;
      }

      .page-content {
        padding: 1.5rem;
      }

      .active-link {
        background: rgba(0, 0, 0, 0.04);
      }

      .menu-badge {
        font-size: 0.75rem;
        background: #e53935;
        color: #fff;
        border-radius: 999px;
        padding: 0 0.4rem;
      }

      .user-menu-trigger mat-icon {
        margin-right: 0.25rem;
      }

      :host-context(.dark-theme) .active-link {
        background: rgba(255, 255, 255, 0.08);
      }
    `,
  ],
})
export class MainLayoutComponent {
  protected readonly auth = inject(AuthService);
  protected readonly menuService = inject(MenuService);
  protected readonly themeService = inject(ThemeService);
  protected readonly notificationService = inject(NotificationService);

  protected readonly profilePath = ROUTE_PATHS.profile;
  protected readonly sidenavOpen = signal(true);

  protected readonly menuItems = this.menuService.menuItems;
  protected readonly notifications = this.notificationService.notifications;
  protected readonly notificationCount = this.notificationService.unreadCount;

  protected readonly userDisplayName = computed(() => {
    const user = this.auth.currentUser();
    return user ? getUserDisplayName(user) : 'Guest';
  });

  protected readonly roleLabel = computed(() => {
    const user = this.auth.currentUser();
    return user ? ROLES[user.role] : '';
  });

  /** Simple breadcrumb trail derived from current URL segments. */
  protected readonly breadcrumbs = computed(() => {
    const segments = window.location.pathname.split('/').filter(Boolean);
    if (segments.length === 0) {
      return [{ label: 'Dashboard', url: ROUTE_PATHS.dashboard }];
    }
    return segments.map((seg, index) => ({
      label: seg.charAt(0).toUpperCase() + seg.slice(1),
      url: '/' + segments.slice(0, index + 1).join('/'),
    }));
  });

  toggleSidenav(): void {
    this.sidenavOpen.update((open) => !open);
  }

  onThemeToggle(checked: boolean): void {
    this.themeService.setTheme(checked ? 'dark' : 'light');
  }

  dismissNotification(id: string): void {
    this.notificationService.dismiss(id);
  }

  logout(): void {
    this.auth.logout();
  }

  iconForType(type: string): string {
    switch (type) {
      case 'success':
        return 'check_circle';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'info';
    }
  }
}

/**
 * LEARNING: Child routes with a shell component provide tab navigation + router-outlet.
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';

import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-settings-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatTabsModule, PageHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-header title="Settings" subtitle="Profile, theme, and form demos" />

    <nav class="settings-tabs" mat-tab-nav-bar [tabPanel]="tabPanel">
      <a mat-tab-link routerLink="profile" routerLinkActive #profile="routerLinkActive" [active]="profile.isActive">
        Profile
      </a>
      <a mat-tab-link routerLink="theme" routerLinkActive #theme="routerLinkActive" [active]="theme.isActive">
        Theme
      </a>
      <a
        mat-tab-link
        routerLink="dynamic-form"
        routerLinkActive
        #dynamic="routerLinkActive"
        [active]="dynamic.isActive"
      >
        Dynamic form
      </a>
    </nav>
    <mat-tab-nav-panel #tabPanel>
      <router-outlet />
    </mat-tab-nav-panel>
  `,
  styles: [
    `
      .settings-tabs {
        margin-bottom: 1rem;
      }
    `,
  ],
})
export class SettingsShellComponent {}

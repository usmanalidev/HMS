/**
 * LEARNING: ThemeService uses signals + effect to sync data-theme on documentElement.
 */

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';

import { ThemeService, type ThemeMode } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-settings',
  standalone: true,
  imports: [FormsModule, MatCardModule, MatRadioModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card class="theme-card">
      <p>Choose application color scheme. Preference is stored in sessionStorage.</p>
      <mat-radio-group
        [ngModel]="themeService.theme()"
        (ngModelChange)="onThemeChange($event)"
        aria-label="Theme mode"
      >
        <mat-radio-button value="light">Light</mat-radio-button>
        <mat-radio-button value="dark">Dark</mat-radio-button>
      </mat-radio-group>
    </mat-card>
  `,
  styles: [
    `
      .theme-card {
        padding: 1.25rem;
        max-width: 24rem;
      }

      mat-radio-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-top: 1rem;
      }
    `,
  ],
})
export class ThemeComponent {
  protected readonly themeService = inject(ThemeService);

  protected onThemeChange(mode: ThemeMode): void {
    this.themeService.setTheme(mode);
  }
}

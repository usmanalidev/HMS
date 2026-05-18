/**
 * ROLE: Shell layout for unauthenticated pages (login, forgot password).
 * WHEN IT RUNS: Parent route component for `/auth/*` child routes.
 * WHAT IT DOES: Centers a Material card with router-outlet for auth feature views.
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, MatCardModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="auth-shell">
      <div class="auth-brand">
        <span class="brand-icon" aria-hidden="true">+</span>
        <div>
          <h1>Healthcare HMS</h1>
          <p>Secure staff portal</p>
        </div>
      </div>
      <mat-card class="auth-card" appearance="outlined">
        <router-outlet />
      </mat-card>
    </div>
  `,
  styles: [
    `
      .auth-shell {
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 1.5rem;
        background: linear-gradient(135deg, #0d47a1 0%, #1565c0 45%, #e3f2fd 100%);
      }

      .auth-brand {
        position: absolute;
        top: 2rem;
        left: 2rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        color: #fff;
      }

      .auth-brand h1 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
      }

      .auth-brand p {
        margin: 0;
        opacity: 0.85;
        font-size: 0.875rem;
      }

      .brand-icon {
        display: grid;
        place-items: center;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 0.5rem;
        background: rgba(255, 255, 255, 0.2);
        font-size: 1.5rem;
        font-weight: 700;
      }

      .auth-card {
        width: min(100%, 420px);
        padding: 0.5rem;
      }
    `,
  ],
})
export class AuthLayoutComponent {}

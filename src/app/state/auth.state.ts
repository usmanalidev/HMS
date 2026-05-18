/**
 * ROLE: Signal-based facade over AuthService for UI layers.
 * WHEN IT RUNS: Injected by login/dashboard components preferring explicit state API.
 * WHAT IT DOES: Mirrors auth session into dedicated signals (loading, error, user).
 */

import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import type { LoginRequest } from '../core/models/auth.model';
import type { User } from '../core/models/user.model';
import { AuthService } from '../core/services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthState {
  private readonly authService = inject(AuthService);

  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly user = this.authService.currentUser;
  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly displayName = computed(() => {
    const u = this.user();
    return u ? `${u.firstName} ${u.lastName}` : '';
  });

  readonly role = computed(() => this.user()?.role ?? null);

  async login(credentials: LoginRequest): Promise<User> {
    this._loading.set(true);
    this._error.set(null);
    try {
      return await firstValueFrom(this.authService.login(credentials));
    } catch {
      this._error.set('Invalid email or password. Try demo credentials from README.');
      throw new Error('Login failed');
    } finally {
      this._loading.set(false);
    }
  }

  logout(): void {
    this.authService.logout();
    this._error.set(null);
  }

  clearError(): void {
    this._error.set(null);
  }
}

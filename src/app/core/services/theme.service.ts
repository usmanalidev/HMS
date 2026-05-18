/**
 * ROLE: Light/dark theme state with persistence.
 * WHEN IT RUNS: Provided in root; initialized on app bootstrap and toggled from layout.
 * WHAT IT DOES: Stores theme in sessionStorage and applies `data-theme` on documentElement.
 */

import { Injectable, computed, effect, signal } from '@angular/core';

import { STORAGE_KEYS } from '../constants/storage-keys.constant';

export type ThemeMode = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly themeSignal = signal<ThemeMode>(this.loadInitialTheme());

  /** Current theme mode (signal). */
  readonly theme = this.themeSignal.asReadonly();

  /** Convenience computed for templates. */
  readonly isDark = computed(() => this.themeSignal() === 'dark');

  constructor() {
    // Learning note: `effect` syncs signal → DOM whenever theme changes
    effect(() => {
      const mode = this.themeSignal();
      document.documentElement.setAttribute('data-theme', mode);
      document.documentElement.classList.toggle('dark-theme', mode === 'dark');
      sessionStorage.setItem(STORAGE_KEYS.THEME, mode);
    });
  }

  toggle(): void {
    this.themeSignal.update((current) => (current === 'light' ? 'dark' : 'light'));
  }

  setTheme(mode: ThemeMode): void {
    this.themeSignal.set(mode);
  }

  private loadInitialTheme(): ThemeMode {
    const stored = sessionStorage.getItem(STORAGE_KEYS.THEME);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }
}

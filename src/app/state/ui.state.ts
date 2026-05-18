import { Injectable, computed, signal } from '@angular/core';

/**
 * Lightweight global UI state (sidebar, loading overlay).
 * Prefer feature-local signals for page-specific UI.
 */
@Injectable({ providedIn: 'root' })
export class UiState {
  private readonly _sidebarCollapsed = signal(false);
  private readonly _globalLoading = signal(false);
  private readonly _loadingMessage = signal<string | null>(null);

  readonly sidebarCollapsed = this._sidebarCollapsed.asReadonly();
  readonly globalLoading = this._globalLoading.asReadonly();
  readonly loadingMessage = this._loadingMessage.asReadonly();

  readonly showLoadingOverlay = computed(
    () => this._globalLoading() && !this._loadingMessage(),
  );

  toggleSidebar(): void {
    this._sidebarCollapsed.update((collapsed) => !collapsed);
  }

  setSidebarCollapsed(collapsed: boolean): void {
    this._sidebarCollapsed.set(collapsed);
  }

  setGlobalLoading(loading: boolean, message?: string | null): void {
    this._globalLoading.set(loading);
    this._loadingMessage.set(message ?? null);
  }

  startLoading(message?: string): void {
    this.setGlobalLoading(true, message);
  }

  stopLoading(): void {
    this.setGlobalLoading(false, null);
  }
}

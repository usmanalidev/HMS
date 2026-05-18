/**
 * ROLE: In-app toast queue backed by Angular signals.
 * WHEN IT RUNS: Injected by interceptors and feature code to surface user feedback.
 * WHAT IT DOES: Pushes/dismisses AppNotification items and exposes readonly signal queue.
 */

import { Injectable, computed, signal } from '@angular/core';

import {
  AppNotification,
  NotificationType,
  createNotificationId,
} from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  /** Internal writable queue; components read via `notifications()`. */
  private readonly queue = signal<readonly AppNotification[]>([]);

  /** Read-only view of active toasts for the layout badge/list. */
  readonly notifications = this.queue.asReadonly();

  /** Count of unread/active notifications (for header badge). */
  readonly unreadCount = computed(() => this.queue().length);

  show(
    type: NotificationType,
    title: string,
    message: string,
    durationMs = 5000,
  ): string {
    const notification: AppNotification = {
      id: createNotificationId(),
      type,
      title,
      message,
      durationMs,
      createdAt: Date.now(),
      dismissible: true,
    };

    this.queue.update((items) => [...items, notification]);

    if (durationMs > 0) {
      window.setTimeout(() => this.dismiss(notification.id), durationMs);
    }

    return notification.id;
  }

  success(title: string, message: string): string {
    return this.show('success', title, message);
  }

  info(title: string, message: string): string {
    return this.show('info', title, message);
  }

  warning(title: string, message: string): string {
    return this.show('warning', title, message);
  }

  error(title: string, message: string): string {
    return this.show('error', title, message, 8000);
  }

  dismiss(id: string): void {
    this.queue.update((items) => items.filter((n) => n.id !== id));
  }

  clear(): void {
    this.queue.set([]);
  }
}

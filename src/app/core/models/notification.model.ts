/**
 * ROLE: In-app toast/alert notification model for the notification queue.
 * WHEN IT RUNS: Created by interceptors, services, and components via NotificationService.
 * WHAT IT DOES: Describes toast type, message, duration, and optional action.
 */

export type NotificationType = 'success' | 'info' | 'warning' | 'error';

/** Single toast entry shown in the layout notification area. */
export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  durationMs: number;
  createdAt: number;
  dismissible: boolean;
  actionLabel?: string;
  actionCallback?: () => void;
}

/** Factory for consistent notification IDs (timestamp + random). */
export function createNotificationId(): string {
  return `notif-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

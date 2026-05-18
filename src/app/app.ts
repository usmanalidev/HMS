/**
 * ROLE: Root component — top of the component tree.
 * WHEN IT RUNS: Bootstrapped once from main.ts; hosts router-outlet and global UI.
 * WHAT IT DOES: Renders child routes; exposes global toast notifications.
 */

import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NotificationService } from './core/services/notification.service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly notifications = inject(NotificationService);

}

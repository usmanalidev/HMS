/**
 * LEARNING: Patch reactive forms from AuthService.currentUser signal on init.
 */

import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="form" (ngSubmit)="onSave()" class="profile-form">
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>First name</mat-label>
        <input matInput formControlName="firstName" />
      </mat-form-field>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Last name</mat-label>
        <input matInput formControlName="lastName" />
      </mat-form-field>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Email</mat-label>
        <input matInput formControlName="email" readonly />
      </mat-form-field>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Department</mat-label>
        <input matInput formControlName="department" />
      </mat-form-field>
      <button mat-flat-button color="primary" type="submit">Save profile (demo)</button>
    </form>
  `,
  styles: [
    `
      .profile-form {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        max-width: 28rem;
      }

      .full-width {
        width: 100%;
      }
    `,
  ],
})
export class ProfileComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly notifications = inject(NotificationService);

  readonly form = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: [{ value: '', disabled: true }],
    department: [''],
  });

  constructor() {
    effect(() => {
      const user = this.auth.currentUser();
      if (user) {
        this.form.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          department: user.department ?? '',
        });
      }
    });
  }

  protected onSave(): void {
    if (this.form.invalid) {
      return;
    }
    this.notifications.success('Profile saved', 'Demo only — not persisted to API.');
  }
}

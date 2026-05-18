/**

 * LEARNING: Build FormGroup dynamically from a field config array — useful for admin builders.

 */



import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import {

  FormBuilder,

  FormControl,

  ReactiveFormsModule,

  Validators,

} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';

import { MatFormFieldModule } from '@angular/material/form-field';

import { MatInputModule } from '@angular/material/input';

import { MatSelectModule } from '@angular/material/select';

import { JsonPipe } from '@angular/common';



import { NotificationService } from '../../../core/services/notification.service';



export interface DynamicFieldConfig {

  key: string;

  label: string;

  type: 'text' | 'number' | 'select';

  required?: boolean;

  options?: { value: string; label: string }[];

}



const DEMO_FIELDS: DynamicFieldConfig[] = [

  { key: 'ward', label: 'Ward', type: 'text', required: true },

  { key: 'bedCount', label: 'Bed count', type: 'number', required: true },

  {

    key: 'priority',

    label: 'Priority',

    type: 'select',

    required: true,

    options: [

      { value: 'low', label: 'Low' },

      { value: 'medium', label: 'Medium' },

      { value: 'high', label: 'High' },

    ],

  },

];



@Component({

  selector: 'app-dynamic-form',

  standalone: true,

  imports: [

    ReactiveFormsModule,

    JsonPipe,

    MatFormFieldModule,

    MatInputModule,

    MatSelectModule,

    MatButtonModule,

  ],

  changeDetection: ChangeDetectionStrategy.OnPush,

  template: `

    <p class="hint">Fields are generated from a config array — add/remove entries without new components.</p>



    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="dynamic-form">

      @for (field of fields; track field.key) {

        @switch (field.type) {

          @case ('select') {

            <mat-form-field appearance="outline" class="full-width">

              <mat-label>{{ field.label }}</mat-label>

              <mat-select [formControlName]="field.key">

                @for (opt of field.options ?? []; track opt.value) {

                  <mat-option [value]="opt.value">{{ opt.label }}</mat-option>

                }

              </mat-select>

            </mat-form-field>

          }

          @default {

            <mat-form-field appearance="outline" class="full-width">

              <mat-label>{{ field.label }}</mat-label>

              <input

                matInput

                [type]="field.type === 'number' ? 'number' : 'text'"

                [formControlName]="field.key"

              />

            </mat-form-field>

          }

        }

      }

      <button mat-flat-button color="primary" type="submit">Submit</button>

    </form>



    @if (submittedValue()) {

      <pre class="output">{{ submittedValue() | json }}</pre>

    }

  `,

  styles: [

    `

      .hint {

        color: var(--mat-sys-on-surface-variant);

        font-size: 0.875rem;

      }



      .dynamic-form {

        max-width: 28rem;

        display: flex;

        flex-direction: column;

        gap: 0.25rem;

      }



      .full-width {

        width: 100%;

      }



      .output {

        margin-top: 1rem;

        padding: 1rem;

        background: var(--mat-sys-surface-container);

        border-radius: 0.5rem;

        font-size: 0.8125rem;

      }

    `,

  ],

})

export class DynamicFormComponent {

  private readonly fb = inject(FormBuilder);

  private readonly notifications = inject(NotificationService);



  protected readonly fields = DEMO_FIELDS;

  protected readonly submittedValue = signal<Record<string, unknown> | null>(null);



  readonly form = this.buildForm();



  private buildForm() {

    const group: Record<string, FormControl> = {};

    for (const field of DEMO_FIELDS) {

      const validators = field.required ? [Validators.required] : [];

      group[field.key] = this.fb.nonNullable.control('', validators);

    }

    return this.fb.group(group);

  }



  protected onSubmit(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;

    }

    const value = this.form.getRawValue();

    this.submittedValue.set(value);

    this.notifications.info('Dynamic form', JSON.stringify(value));

  }

}



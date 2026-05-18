/**

 * LEARNING: Reactive forms centralize validation; AuthState wraps AuthService for UI loading/errors.

 * Demo credentials are shown for local json-server — see mock-api/README.md.

 */



import {

  ChangeDetectionStrategy,

  Component,

  inject,

  signal,

} from '@angular/core';

import {

  FormBuilder,

  ReactiveFormsModule,

  Validators,

} from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';

import { MatCheckboxModule } from '@angular/material/checkbox';

import { MatFormFieldModule } from '@angular/material/form-field';

import { MatIconModule } from '@angular/material/icon';

import { MatInputModule } from '@angular/material/input';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';



import { ROUTE_PATHS } from '../../../core/constants/routes.constant';

import { AuthState } from '../../../state/auth.state';

import { emailDomainValidator } from '../../../shared/utils/form-validators';



/** Demo accounts from mock-api/db.json (passwords in template hints). */

const DEMO_ACCOUNTS = [

  { role: 'Admin', email: 'admin@metrohealth.org', password: 'admin123' },

  { role: 'Doctor', email: 'doctor@metrohealth.org', password: 'doctor123' },

  { role: 'Nurse', email: 'nurse@metrohealth.org', password: 'nurse123' },

  {

    role: 'Receptionist',

    email: 'receptionist@metrohealth.org',

    password: 'receptionist123',

  },

] as const;



@Component({

  selector: 'app-login',

  standalone: true,

  imports: [

    ReactiveFormsModule,


    MatFormFieldModule,

    MatInputModule,

    MatButtonModule,

    MatCheckboxModule,

    MatIconModule,

    MatProgressSpinnerModule,

  ],

  templateUrl: './login.component.html',

  styleUrl: './login.component.scss',

  changeDetection: ChangeDetectionStrategy.OnPush,

})

export class LoginComponent {

  private readonly fb = inject(FormBuilder);

  private readonly authState = inject(AuthState);

  private readonly router = inject(Router);

  private readonly route = inject(ActivatedRoute);



  protected readonly demoAccounts = DEMO_ACCOUNTS;

  protected readonly hidePassword = signal(true);



  readonly form = this.fb.nonNullable.group({

    email: [

      '',

      [Validators.required, Validators.email, emailDomainValidator('metrohealth.org')],

    ],

    password: ['', [Validators.required, Validators.minLength(6)]],

    rememberMe: [false],

  });



  protected readonly loading = this.authState.loading;

  protected readonly error = this.authState.error;



  protected async onSubmit(): Promise<void> {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;

    }



    this.authState.clearError();

    const { email, password, rememberMe } = this.form.getRawValue();



    try {

      await this.authState.login({ email, password, rememberMe });

      const returnUrl =

        this.route.snapshot.queryParamMap.get('returnUrl') ?? ROUTE_PATHS.dashboard;

      await this.router.navigateByUrl(returnUrl);

    } catch {

      // Error surfaced via AuthState.error signal

    }

  }



  protected fillDemo(account: (typeof DEMO_ACCOUNTS)[number]): void {

    this.form.patchValue({

      email: account.email,

      password: account.password,

    });

  }



  protected togglePasswordVisibility(): void {

    this.hidePassword.update((hidden) => !hidden);

  }

}



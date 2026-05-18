import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * LEARNING: ValidatorFn functions plug into Reactive Forms and return errors or null.
 *
 * Compose validators in FormControl/FormGroup definitions:
 *   email: ['', [Validators.required, emailDomainValidator('hospital.org')]]
 *
 * Custom validators keep business rules testable and separate from components.
 */

/** Requires the email address to end with `@domain` (case-insensitive). */
export function emailDomainValidator(allowedDomain: string): ValidatorFn {
  const normalizedDomain = allowedDomain.replace(/^@/, '').toLowerCase();

  return (control: AbstractControl): ValidationErrors | null => {
    const value = (control.value as string | null | undefined)?.trim();
    if (!value) {
      return null;
    }

    const atIndex = value.lastIndexOf('@');
    if (atIndex === -1) {
      return { emailDomain: { requiredDomain: normalizedDomain, actual: value } };
    }

    const domain = value.slice(atIndex + 1).toLowerCase();
    if (domain !== normalizedDomain) {
      return { emailDomain: { requiredDomain: normalizedDomain, actual: domain } };
    }

    return null;
  };
}

export interface PasswordStrengthErrors {
  minLength?: boolean;
  uppercase?: boolean;
  lowercase?: boolean;
  digit?: boolean;
  special?: boolean;
}

export interface PasswordStrengthOptions {
  minLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireDigit?: boolean;
  requireSpecial?: boolean;
}

const DEFAULT_PASSWORD_OPTIONS: Required<PasswordStrengthOptions> = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireDigit: true,
  requireSpecial: true,
};

/**
 * Enforces configurable password complexity for registration / reset flows.
 */
export function passwordStrengthValidator(
  options: PasswordStrengthOptions = {},
): ValidatorFn {
  const config = { ...DEFAULT_PASSWORD_OPTIONS, ...options };

  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string | null | undefined;
    if (!value) {
      return null;
    }

    const errors: PasswordStrengthErrors = {};

    if (value.length < config.minLength) {
      errors.minLength = true;
    }
    if (config.requireUppercase && !/[A-Z]/.test(value)) {
      errors.uppercase = true;
    }
    if (config.requireLowercase && !/[a-z]/.test(value)) {
      errors.lowercase = true;
    }
    if (config.requireDigit && !/\d/.test(value)) {
      errors.digit = true;
    }
    if (config.requireSpecial && !/[^A-Za-z0-9]/.test(value)) {
      errors.special = true;
    }

    return Object.keys(errors).length > 0 ? { passwordStrength: errors } : null;
  };
}

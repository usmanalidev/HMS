/**
 * ROLE: Example CanDeactivate guard for dirty forms.
 * WHEN IT RUNS: Before leaving a route whose component implements `CanComponentDeactivate`.
 * WHAT IT DOES: Prompts user if unsaved changes exist; allows navigation when clean or confirmed.
 */

import { CanDeactivateFn } from '@angular/router';

/** Contract for components that track dirty state (e.g. patient edit form). */
export interface CanComponentDeactivate {
  canDeactivate: () => boolean | Promise<boolean>;
}

export const unsavedChangesGuard: CanDeactivateFn<CanComponentDeactivate> = (
  component,
) => {
  if (!component?.canDeactivate) {
    return true;
  }

  const result = component.canDeactivate();

  if (typeof result === 'boolean') {
    if (result) {
      return true;
    }
    return window.confirm(
      'You have unsaved changes. Leave this page and discard them?',
    );
  }

  return result.then((ok) => {
    if (ok) {
      return true;
    }
    return window.confirm(
      'You have unsaved changes. Leave this page and discard them?',
    );
  });
};

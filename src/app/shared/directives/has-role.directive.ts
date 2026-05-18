import {
  Directive,
  inject,
  InjectionToken,
  Input,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';

/**
 * LEARNING: Structural directives control whether a template is rendered in the DOM.
 *
 * The microsyntax `*appHasRole="'admin'"` desugars to:
 *   <ng-template [appHasRole]="'admin'">...</ng-template>
 *
 * Provide a RoleChecker implementation (e.g. from AuthService) via the ROLE_CHECKER token
 * in app.config.ts so this directive can show/hide UI by permission.
 *
 * Usage:
 *   <button *appHasRole="'admin'">Manage users</button>
 *   <section *appHasRole="['doctor', 'nurse']">Clinical tools</section>
 */
export interface RoleChecker {
  hasRole(role: string): boolean;
  hasAnyRole(roles: string[]): boolean;
  rolesChanged$?: Observable<unknown>;
}

export const ROLE_CHECKER = new InjectionToken<RoleChecker>('ROLE_CHECKER', {
  factory: (): RoleChecker => ({
    hasRole: () => false,
    hasAnyRole: () => false,
  }),
});

@Directive({
  selector: '[appHasRole]',
  standalone: true,
})
export class HasRoleDirective implements OnDestroy {
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly roleChecker = inject(ROLE_CHECKER);

  private requiredRoles: string[] = [];
  private subscription?: Subscription;
  private hasView = false;

  @Input()
  set appHasRole(role: string | string[]) {
    this.requiredRoles = Array.isArray(role) ? role : [role];
    this.updateView();
    this.listenForRoleChanges();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private listenForRoleChanges(): void {
    this.subscription?.unsubscribe();
    if (!this.roleChecker.rolesChanged$) {
      return;
    }
    this.subscription = this.roleChecker.rolesChanged$.subscribe(() => this.updateView());
  }

  private updateView(): void {
    const allowed =
      this.requiredRoles.length === 1
        ? this.roleChecker.hasRole(this.requiredRoles[0])
        : this.roleChecker.hasAnyRole(this.requiredRoles);

    if (allowed && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!allowed && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}

import { AfterViewInit, Directive, ElementRef, inject, Input } from '@angular/core';

/**
 * LEARNING: Attribute directives are ideal for small DOM behaviors reusable across features.
 *
 * Native `autofocus` only runs on initial page load. This directive focuses elements when
 * Angular inserts them (dialogs, routed views, *ngIf blocks).
 *
 * Usage:
 *   <input appAutofocus />
 *   <input [appAutofocus]="shouldFocus" />
 */
@Directive({
  selector: '[appAutofocus]',
  standalone: true,
})
export class AutofocusDirective implements AfterViewInit {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  /** When false, the directive skips focusing (default: true). */
  @Input() appAutofocus: boolean | '' = true;

  ngAfterViewInit(): void {
    const enabled = this.appAutofocus === '' || this.appAutofocus === true;
    if (!enabled) {
      return;
    }

    queueMicrotask(() => {
      const element = this.elementRef.nativeElement;
      if (typeof element.focus === 'function') {
        element.focus({ preventScroll: false });
      }
    });
  }
}

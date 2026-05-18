import {
  Directive,
  ElementRef,
  inject,
  Input,
  OnChanges,
  Renderer2,
  SecurityContext,
  SimpleChanges,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * LEARNING: Attribute directives change the appearance or behavior of an existing element.
 *
 * This directive wraps matching search terms in a <mark> element. It reads textContent,
 * rebuilds innerHTML, and sanitizes output to reduce XSS risk when highlighting dynamic text.
 *
 * Usage:
 *   <p appHighlight [searchTerm]="query" [text]="patient.notes">{{ patient.notes }}</p>
 *
 * Prefer binding `[text]` when the displayed string differs from projected content.
 */
@Directive({
  selector: '[appHighlight]',
  standalone: true,
})
export class HighlightDirective implements OnChanges {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly sanitizer = inject(DomSanitizer);

  /** Term to highlight (case-insensitive). */
  @Input() searchTerm = '';

  /** Optional explicit source string; falls back to element textContent. */
  @Input() text?: string;

  /** CSS class applied to <mark> wrappers. */
  @Input() highlightClass = 'search-highlight';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchTerm'] || changes['text'] || changes['highlightClass']) {
      this.renderHighlight();
    }
  }

  private renderHighlight(): void {
    const source = (this.text ?? this.elementRef.nativeElement.textContent ?? '').trim();
    const term = this.searchTerm.trim();

    if (!source) {
      this.setInnerHtml('');
      return;
    }

    if (!term) {
      this.setInnerHtml(this.escapeHtml(source));
      return;
    }

    const pattern = new RegExp(`(${this.escapeRegExp(term)})`, 'gi');
    const highlighted = source.replace(
      pattern,
      `<mark class="${this.highlightClass}">$1</mark>`,
    );
    this.setInnerHtml(highlighted);
  }

  private setInnerHtml(html: string): void {
    const safe =
      this.sanitizer.sanitize(SecurityContext.HTML, html) ?? '';
    this.renderer.setProperty(this.elementRef.nativeElement, 'innerHTML', safe);
  }

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}

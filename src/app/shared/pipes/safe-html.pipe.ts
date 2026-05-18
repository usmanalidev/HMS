import { inject, Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * LEARNING: Angular sanitizes bound HTML by default to prevent XSS attacks.
 *
 * DomSanitizer marks trusted content when you have already validated it server-side
 * or it comes from a strictly controlled source. Never bypass sanitization for raw
 * user input.
 *
 * Usage:
 *   <div [innerHTML]="richText | safeHtml"></div>
 *
 * Prefer `[innerHTML]` with this pipe over `bypassSecurityTrustHtml` scattered in components.
 */
@Pipe({
  name: 'safeHtml',
  standalone: true,
  pure: true,
})
export class SafeHtmlPipe implements PipeTransform {
  private readonly sanitizer = inject(DomSanitizer);

  transform(value: string | null | undefined): SafeHtml {
    if (value == null || value === '') {
      return '';
    }

    const cleaned = this.sanitizer.sanitize(SecurityContext.HTML, value) ?? '';
    return this.sanitizer.bypassSecurityTrustHtml(cleaned);
  }
}

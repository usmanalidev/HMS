import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * LEARNING: Reusable informational components teach concepts in-place during development.
 *
 * Pass topic strings from feature modules to document what a screen practices
 * (routing, signals, HTTP, etc.) without duplicating markup.
 */
@Component({
  selector: 'app-learning-banner',
  standalone: true,
  templateUrl: './learning-banner.component.html',
  styleUrl: './learning-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearningBannerComponent {
  /** Bullet list of concepts demonstrated on the current page. */
  @Input() topics: string[] = [];

  /** Optional heading override. */
  @Input() heading = "What you're learning";
}

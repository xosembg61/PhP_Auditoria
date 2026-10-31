import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CHAPTERS } from '../content/incident';
import { GUIDE_WALKTHROUGHS } from '../content/walkthroughs';
import { LearningVideoComponent } from '../shared/learning-video';
import { ProgressService } from '../core/progress';
import { PageHeaderComponent, IconComponent, InfoExpanderComponent } from '../shared/ui';
@Component({
  imports: [
    RouterLink,
    PageHeaderComponent,
    IconComponent,
    InfoExpanderComponent,
    LearningVideoComponent,
  ],
  templateUrl: './guide.html',
})
export class GuidePage {
  readonly p = inject(ProgressService);
  readonly chapters = CHAPTERS;
  readonly walkthroughs = GUIDE_WALKTHROUGHS;
  jump(index: number) {
    const heading = document.getElementById('guide-chapter-' + index);
    heading?.focus({ preventScroll: true });
    heading?.scrollIntoView?.({
      block: 'start',
      behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    });
  }
}

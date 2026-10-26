import { Component, input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProgressService } from '../core/progress';
import { refById } from '../content/references';
@Component({
  selector: 'app-icon',
  template: `<svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path [attr.d]="paths[name()] || paths['file']" />
  </svg>`,
})
export class IconComponent {
  readonly name = input('shield');
  readonly paths: Record<string, string> = {
    shield: 'M12 3 20 6v6c0 5-8 9-8 9s-8-4-8-9V6z M8 12l3 3 5-6',
    layers: 'm12 3 10 5-10 5L2 8z M2 12l10 5 10-5 M2 16l10 5 10-5',
    search: 'M21 21l-5-5 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
    file: 'M14 2H5v20h14V7z M14 2v6h5 M8 12h8 M8 16h6',
    arrow: 'M4 12h16 M14 6l6 6-6 6',
    check: 'M5 12l4 4L19 6',
    clock: 'M12 8v5l4 2 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
    terminal: 'm5 7 5 5-5 5 M13 17h6',
    lock: 'M6 10h12v11H6z M8 10V6a4 4 0 0 1 8 0v4 M12 14v3',
    book: 'M12 5v16 M12 5C8 2 3 3 2 4v15c3-2 7-1 10 2 3-3 7-4 10-2V4c-2-1-7-2-10 1',
    external: 'M14 3h7v7 M21 3 10 14 M10 3H3v18h18v-7',
    menu: 'M3 6h18 M3 12h18 M3 18h18',
    close: 'm6 6 12 12 M6 18 18 6',
    download: 'M12 3v12 m-5-5 5 5 5-5 M4 17v4h16v-4',
    trophy:
      'M7 3h10v7a5 5 0 0 1-10 0z M7 5H3v3a4 4 0 0 0 4 4 M17 5h4v3a4 4 0 0 1-4 4 M12 15v6 M7 21h10',
    info: 'M12 11v6 M12 7h.01 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
    alert: 'm12 3 10 18H2z M12 9v5 M12 17h.01',
    code: 'm8 6-6 6 6 6 m8-12 6 6-6 6 m-3-15-2 18',
  };
}
@Component({
  selector: 'app-page-header',
  imports: [RouterLink],
  template: `<div class="page-heading">
    <a class="breadcrumb" routerLink="/"
      >Inicio <span>/ {{ eyebrow() }}</span></a
    >
    <div class="eyebrow">{{ eyebrow() }}</div>
    <h1>{{ title() }}</h1>
    <p>{{ description() }}</p>
  </div>`,
})
export class PageHeaderComponent {
  readonly title = input('');
  readonly description = input('');
  readonly eyebrow = input('Explorar');
}
@Component({
  selector: 'app-source-refs',
  imports: [IconComponent],
  template: `<div class="source-refs">
    <span>Fuentes:</span>
    @for (id of ids(); track id) {
      @if (source(id); as s) {
        <a [href]="s.url" target="_blank" rel="noopener noreferrer"
          >{{ s.org }} <app-icon name="external"
        /></a>
      }
    }
  </div>`,
})
export class SourceRefsComponent {
  readonly ids = input<string[]>([]);
  source = refById;
}
@Component({
  selector: 'app-progress-ring',
  template: `<div
    class="progress-ring"
    [style.--progress]="percent() + '%'"
    role="img"
    [attr.aria-label]="label() + ': ' + done() + ' de ' + total()"
  >
    <div>
      <strong>{{ percent() }}<small>%</small></strong
      ><span>{{ done() }} / {{ total() }}</span>
    </div>
  </div>`,
})
export class ProgressRingComponent {
  readonly done = input(0);
  readonly total = input(1);
  readonly label = input('Progreso documentado');
  percent() {
    return this.total() ? Math.round((this.done() / this.total()) * 100) : 0;
  }
}
@Component({
  selector: 'app-info-expander',
  template: `<details class="info-expander" [open]="p.detailedHelp()" [attr.name]="group() || null">
    <summary>ⓘ {{ title() }}</summary>
    <div class="expander-body"><ng-content /></div>
  </details>`,
})
export class InfoExpanderComponent {
  readonly p = inject(ProgressService);
  readonly title = input('Ampliar información');
  readonly group = input('');
}
@Component({
  selector: 'app-achievement-notice',
  imports: [IconComponent],
  template: `@if (p.notice(); as n) {
      <aside class="achievement-notice" aria-label="Logro desbloqueado">
        <div class="achievement-burst" aria-hidden="true">
          @for (i of particles; track i) {
            <i [style.--i]="i"></i>
          }
        </div>
        <span class="achievement-icon"><app-icon name="trophy" /></span>
        <div>
          <small>{{ n.mode === 'demo' ? 'LOGRO DE APRENDIZAJE' : 'ETAPA DOCUMENTADA' }}</small>
          <h2>{{ n.title }}</h2>
          <p>{{ n.message }}</p>
          <button class="text-button" (click)="p.dismiss()">
            Continuar <app-icon name="arrow" />
          </button>
        </div>
      </aside>
    }
    <div class="sr-only" aria-live="polite">{{ p.notice()?.title }}</div>`,
})
export class AchievementNoticeComponent {
  readonly p = inject(ProgressService);
  readonly particles = Array.from({ length: 16 }, (_, i) => i);
}

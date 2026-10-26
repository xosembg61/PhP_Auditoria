import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CHAPTERS } from '../content/incident';
import { ProgressService } from '../core/progress';
import { PageHeaderComponent, IconComponent, InfoExpanderComponent } from '../shared/ui';
@Component({
  imports: [RouterLink, PageHeaderComponent, IconComponent, InfoExpanderComponent],
  template: `<div class="container page">
    <app-page-header
      eyebrow="Guía"
      title="Aprende a revisar. Paso a paso."
      description="Seis capítulos para comprender, verificar e investigar. El progreso de lectura y el de comprobaciones son distintos."
    />
    <div class="guide-intro panel">
      <div>
        <span class="eyebrow">ELIGE CÓMO RECORRER LA GUÍA</span>
        <h2>Un entorno seguro para aprender.</h2>
        <p>
          La demo es ficticia. La plantilla organiza una revisión autorizada y comienza sin
          verificaciones. No se comprueban servidores automáticamente.
        </p>
      </div>
      <div class="button-row">
        <button
          class="button"
          [class.primary]="p.mode() === 'demo'"
          [class.secondary]="p.mode() !== 'demo'"
          (click)="p.setMode('demo')"
        >
          Probar con datos de ejemplo</button
        ><button
          class="button"
          [class.primary]="p.mode() === 'template'"
          [class.secondary]="p.mode() !== 'template'"
          (click)="p.setMode('template')"
        >
          Usar como guía de auditoría
        </button>
      </div>
    </div>
    <div class="guide-progress">
      <span class="badge">{{ p.mode() === 'demo' ? 'DEMO' : 'PLANTILLA' }}</span
      ><span>Aprendizaje: {{ p.state().chapters.length }} / 6 capítulos</span
      ><span>Comprobaciones: {{ p.count() }} / 18 tareas</span>
    </div>
    <div class="guide-layout">
      <nav class="chapter-list" aria-label="Capítulos de la guía">
        @for (c of chapters; track c.title; let i = $index) {
          <button
            [class.active]="active() === i"
            [attr.aria-pressed]="active() === i"
            (click)="active.set(i)"
          >
            <span class="chapter-number">{{ p.state().chapters.includes(i) ? '✓' : i + 1 }}</span
            ><span
              >{{ c.title }}
              @if (c.section) {
                <small
                  >{{ p.section(c.section).done }} / {{ p.section(c.section).total }} tareas</small
                >
              }
            </span>
          </button>
        }
      </nav>
      <article class="panel chapter-panel">
        <span class="eyebrow">CAPÍTULO {{ active() + 1 }} DE 6 · {{ current().subtitle }}</span>
        <h2>{{ current().title }}</h2>
        <p class="lead">{{ current().text }}</p>
        <div class="callout">
          <strong>Al terminar sabrás…</strong>
          <p>{{ current().expected }}</p>
        </div>
        <app-info-expander title="Ampliar información / ver ejemplo"
          ><h3>Cómo trabajar este capítulo</h3>
          <p>{{ current().example }}</p>
          <p>
            Consulta el módulo enlazado, contrasta sus fuentes y registra qué sabes y qué falta.
            Leer un capítulo no marca tareas como comprobadas.
          </p>
          <p>
            Si no puedes verificar un dato, conserva el estado pendiente o documenta el bloqueo.
          </p></app-info-expander
        ><a
          class="button primary"
          [routerLink]="current().route"
          [queryParams]="current().section ? { section: current().section } : {}"
          >{{ current().action }} <app-icon name="arrow"
        /></a>
        <div class="chapter-complete">
          <button
            class="button secondary"
            (click)="p.markChapter(active())"
            [disabled]="p.state().chapters.includes(active())"
          >
            <app-icon name="check" />{{
              p.state().chapters.includes(active())
                ? 'Capítulo completado'
                : 'He leído y completado el capítulo'
            }}
          </button>
        </div>
        <div class="chapter-navigation">
          <button
            class="text-button"
            [disabled]="active() === 0"
            (click)="active.set(active() - 1)"
          >
            ← Anterior</button
          ><span>{{ active() + 1 }} / 6</span
          ><button
            class="text-button"
            [disabled]="active() === 5"
            (click)="active.set(active() + 1)"
          >
            Siguiente →
          </button>
        </div>
      </article>
    </div>
    <section class="panel section-space">
      <div class="panel-heading">
        <app-icon name="trophy" />
        <h2>Investigador PHP2Shell</h2>
      </div>
      <p>
        {{
          p.state().chapters.length === 6
            ? 'Ruta educativa completada. Puedes volver a cualquier capítulo.'
            : 'Completa los seis capítulos para desbloquear el logro de aprendizaje.'
        }}
      </p>
      @if (p.state().chapters.length === 6) {
        <button
          class="text-button"
          (click)="
            p.replay(
              'learning',
              'Investigador PHP2Shell',
              'Has completado el recorrido de aprendizaje.'
            )
          "
        >
          Ver logro / reproducir animación
        </button>
      }
    </section>
    <a class="text-link" routerLink="/conclusiones"
      >Revisar las conclusiones <app-icon name="arrow"
    /></a>
  </div>`,
})
export class GuidePage {
  readonly p = inject(ProgressService);
  readonly chapters = CHAPTERS;
  readonly active = signal(0);
  constructor() {
    const done = this.p.state().chapters;
    this.active.set(
      CHAPTERS.findIndex((_, i) => !done.includes(i)) === -1
        ? 5
        : CHAPTERS.findIndex((_, i) => !done.includes(i)),
    );
  }
  current() {
    return CHAPTERS[this.active()];
  }
}

import { Component, DestroyRef, afterNextRender, inject, signal } from '@angular/core';

@Component({
  selector: 'app-reading-tools',
  template: `@if (hasScroll()) {
      <div
        class="reading-progress"
        role="progressbar"
        aria-label="Página recorrida; no acredita aprendizaje"
        aria-valuemin="0"
        aria-valuemax="100"
        [attr.aria-valuenow]="percent()"
      >
        <span [style.transform]="'scaleX(' + percent() / 100 + ')'"></span>
      </div>
    }
    @if (showTop()) {
      <button
        type="button"
        class="back-to-top"
        aria-label="Volver al principio del contenido"
        (click)="toTop()"
      >
        <svg class="top-arrow" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 20V4m-6 6 6-6 6 6" /></svg
        ><span>Volver arriba</span>
      </button>
    }`,
})
export class ReadingToolsComponent {
  readonly percent = signal(0);
  readonly hasScroll = signal(false);
  readonly showTop = signal(false);
  constructor() {
    const destroy = inject(DestroyRef);
    afterNextRender(() => {
      let frame = 0;
      const measure = () => {
        frame = 0;
        const main = document.getElementById('contenido');
        const bottom = main
          ? main.getBoundingClientRect().bottom + window.scrollY
          : document.documentElement.scrollHeight;
        const distance = Math.max(0, bottom - window.innerHeight);
        this.hasScroll.set(distance > 80);
        this.percent.set(
          distance > 0
            ? Math.round(Math.min(100, Math.max(0, (window.scrollY / distance) * 100)))
            : 0,
        );
        this.showTop.set(window.scrollY > 500);
      };
      const schedule = () => {
        if (!frame) frame = requestAnimationFrame(measure);
      };
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule);
      const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(schedule) : null;
      const main = document.getElementById('contenido');
      if (main) observer?.observe(main);
      schedule();
      destroy.onDestroy(() => {
        window.removeEventListener('scroll', schedule);
        window.removeEventListener('resize', schedule);
        observer?.disconnect();
        if (frame) cancelAnimationFrame(frame);
      });
    });
  }
  toTop() {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'instant' : 'smooth' });
    document.getElementById('contenido')?.focus({ preventScroll: true });
  }
}

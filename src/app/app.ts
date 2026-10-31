import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { IconComponent, AchievementNoticeComponent } from './shared/ui';
import { ThemeToggleComponent } from './shared/theme-toggle';
import { ContentSearchComponent } from './shared/content-search';
import { ReadingToolsComponent } from './shared/reading-tools';
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    IconComponent,
    AchievementNoticeComponent,
    ThemeToggleComponent,
    ContentSearchComponent,
    ReadingToolsComponent,
  ],
  templateUrl: './app.html',
})
export class App {
  readonly exploreOpen = signal(false);
  readonly links = [
    { path: '/', label: 'Inicio' },
    { path: '/incidente', label: 'Incidente' },
    { path: '/versiones', label: 'Versiones' },
  ];
  readonly exploreGroups = [
    {
      title: 'Entender',
      description: 'El contexto, a tu ritmo',
      links: [
        {
          path: '/guia',
          label: 'Guía paso a paso',
          detail: 'Los seis capítulos, juntos',
          icon: 'book',
        },
        { path: '/cronologia', label: 'Cronología', detail: 'Cómo se descubrió', icon: 'clock' },
        {
          path: '/vulnerabilidades',
          label: 'Los dos CVE',
          detail: 'Qué falla en la memoria',
          icon: 'code',
        },
      ],
    },
    {
      title: 'Practicar',
      description: 'Del concepto a la evidencia',
      links: [
        {
          path: '/auditoria',
          label: 'Auditoría guiada',
          detail: 'Una comprobación cada vez',
          icon: 'shield',
        },
        {
          path: '/laboratorio',
          label: 'Laboratorio de indicios',
          detail: 'Tres casos para investigar',
          icon: 'terminal',
        },
        {
          path: '/aula',
          label: 'Aula práctica',
          detail: 'Ejemplos y plan personal',
          icon: 'layers',
        },
      ],
    },
    {
      title: 'Consultar',
      description: 'Lo necesario para cerrar el caso',
      links: [
        {
          path: '/conclusiones',
          label: 'Conclusiones',
          detail: 'Qué puedes afirmar',
          icon: 'check',
        },
        {
          path: '/fuentes',
          label: 'Fuentes y créditos',
          detail: 'Referencias reunidas aquí',
          icon: 'file',
        },
        {
          path: '/ayuda',
          label: 'Glosario y preferencias',
          detail: 'Términos, tema y ayudas',
          icon: 'info',
        },
      ],
    },
  ];
  closeExplore() {
    const panel = document.getElementById('explore-panel');
    if (this.exploreOpen()) panel?.hidePopover?.();
    this.exploreOpen.set(false);
  }
  onExploreToggle(event: Event) {
    this.exploreOpen.set((event as ToggleEvent).newState === 'open');
  }
  focusMain(event: Event) {
    event.preventDefault();
    document.getElementById('contenido')?.focus();
  }
  onPageChange() {
    this.closeExplore();
    window.scrollTo({ top: 0, behavior: 'instant' });
    setTimeout(() => document.getElementById('contenido')?.focus({ preventScroll: true }));
  }
}

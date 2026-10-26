import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { IconComponent, AchievementNoticeComponent } from './shared/ui';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, IconComponent, AchievementNoticeComponent],
  templateUrl: './app.html',
})
export class App {
  readonly menuOpen = signal(false);
  readonly links = [
    { path: '/', label: 'Inicio' },
    { path: '/incidente', label: 'Incidente' },
    { path: '/versiones', label: 'Versiones' },
    { path: '/auditoria', label: 'Auditoría' },
    { path: '/guia', label: 'Guía' },
    { path: '/fuentes', label: 'Fuentes' },
  ];
  focusMain(event: Event) {
    event.preventDefault();
    document.getElementById('contenido')?.focus();
  }
  onPageChange() {
    this.menuOpen.set(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
    setTimeout(() => document.getElementById('contenido')?.focus({ preventScroll: true }));
  }
}

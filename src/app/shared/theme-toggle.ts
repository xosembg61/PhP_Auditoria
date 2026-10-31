import { Component, inject } from '@angular/core';
import { AppearanceService } from '../core/appearance';

@Component({
  selector: 'app-theme-toggle',
  template: `<button
    type="button"
    class="theme-switch"
    role="switch"
    aria-label="Modo oscuro"
    [attr.aria-checked]="theme.dark()"
    [title]="theme.dark() ? 'Activar modo claro' : 'Activar modo oscuro'"
    (click)="theme.toggle()"
  >
    <span class="theme-sky" aria-hidden="true"></span>
    <span class="theme-knob" aria-hidden="true"></span>
  </button>`,
})
export class ThemeToggleComponent {
  readonly theme = inject(AppearanceService);
}

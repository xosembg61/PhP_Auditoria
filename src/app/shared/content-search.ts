import { Component, ElementRef, HostListener, computed, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { searchContent } from '../content/search-index';
import { IconComponent } from './ui';

@Component({
  selector: 'app-content-search',
  imports: [FormsModule, RouterLink, IconComponent],
  template: `<button
      type="button"
      class="search-trigger"
      (click)="open()"
      aria-label="Buscar contenido"
      aria-haspopup="dialog"
      title="Buscar contenido (Ctrl o Cmd + K)"
    >
      <app-icon name="search" /><span>Buscar</span><kbd>Ctrl K</kbd>
    </button>
    <dialog
      #searchDialog
      class="content-search"
      aria-labelledby="search-title"
      (click)="backdrop($event)"
    >
      <div class="search-dialog-heading">
        <div>
          <span class="eyebrow">ENCUENTRA TU SIGUIENTE PASO</span>
          <h2 id="search-title">¿Qué quieres entender?</h2>
        </div>
        <button type="button" class="search-close" aria-label="Cerrar búsqueda" (click)="close()">
          <app-icon name="close" />
        </button>
      </div>
      <label class="sr-only" for="content-query">Buscar en la web</label>
      <div class="search-input-wrap">
        <app-icon name="search" /><input
          #queryInput
          id="content-query"
          type="search"
          autocomplete="off"
          maxlength="160"
          placeholder="Por ejemplo: backport, versión, evidencias…"
          [ngModel]="query()"
          (ngModelChange)="query.set($event)"
          (keydown.arrowdown)="focusFirst($event)"
        />
      </div>
      <p class="search-count" role="status">
        {{
          query().trim() ? results().length + ' resultados (máximo 12)' : 'Sugerencias para empezar'
        }}
      </p>
      <div class="search-results">
        @for (entry of results(); track entry.id) {
          <a [routerLink]="entry.path" [queryParams]="entry.params || {}" (click)="close(false)">
            <span class="search-category">{{ entry.category }}</span
            ><strong>{{ entry.title }}</strong
            ><span>{{ entry.description }}</span
            ><app-icon name="arrow" />
          </a>
        } @empty {
          <div class="search-empty">
            <app-icon name="book" />
            <h3>No hemos encontrado ese término.</h3>
            <p>Prueba con «PHP», «parches», «logs» o «inventario».</p>
            <button type="button" class="button secondary" (click)="clear()">
              Ver sugerencias
            </button>
          </div>
        }
      </div>
      <p class="search-hint">
        Tab para recorrer · Esc para cerrar · Busca títulos y resúmenes; tus notas de auditoría
        quedan fuera.
      </p>
    </dialog>`,
})
export class ContentSearchComponent {
  readonly query = signal('');
  readonly results = computed(() => searchContent(this.query()));
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('searchDialog');
  private readonly input = viewChild.required<ElementRef<HTMLInputElement>>('queryInput');
  private previousFocus: HTMLElement | null = null;
  open() {
    if (this.dialog().nativeElement.open) return;
    this.previousFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    this.query.set('');
    this.dialog().nativeElement.showModal();
    this.input().nativeElement.focus();
  }
  close(restoreFocus = true) {
    this.dialog().nativeElement.close();
    if (restoreFocus && this.previousFocus?.isConnected) this.previousFocus.focus();
  }
  clear() {
    this.query.set('');
    this.input().nativeElement.focus();
  }
  backdrop(event: MouseEvent) {
    if (event.target === this.dialog().nativeElement) this.close();
  }
  focusFirst(event: Event) {
    const first = this.dialog().nativeElement.querySelector<HTMLAnchorElement>('.search-results a');
    if (first) {
      event.preventDefault();
      first.focus();
    }
  }
  @HostListener('document:keydown', ['$event']) shortcut(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && !event.altKey && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      if (this.dialog().nativeElement.open) this.close();
      else this.open();
    }
  }
}

import { Component, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TaskDefinition, TaskStatus, STATUSES } from '../content/audit';
import { ProgressService } from '../core/progress';
import { InfoExpanderComponent, SourceRefsComponent, IconComponent } from './ui';
@Component({
  selector: 'app-audit-task',
  imports: [FormsModule, RouterLink, InfoExpanderComponent, SourceRefsComponent, IconComponent],
  template: `<article class="audit-task" [class.task-verified]="current().status === 'verified'">
    <div class="task-heading">
      <span class="task-id mono">{{ task().id }}</span>
      <div>
        <h3>{{ task().title }}</h3>
        <p>{{ task().what }}</p>
      </div>
      <span [class]="'badge task-status ' + current().status">{{
        statusLabel(current().status)
      }}</span>
    </div>
    <app-info-expander title="Ampliar información / ¿Cómo hago este paso?" [group]="task().section"
      ><div class="help-grid">
        <div>
          <h4>Qué comprobamos</h4>
          <p>{{ task().what }}</p>
          <h4>Por qué importa</h4>
          <p>{{ task().why }}</p>
          <h4>Qué necesitas</h4>
          <p>{{ task().needs }}</p>
          <h4>Cómo se comprueba</h4>
          <ol>
            @for (step of task().how; track step) {
              <li>{{ step }}</li>
            }
          </ol>
        </div>
        <div>
          <h4>Resultado y evidencia esperada</h4>
          <p>{{ task().evidence }}</p>
          <h4>Cómo lo documento</h4>
          <p>
            Anota origen, fecha y referencia saneada. Distingue observación directa de información
            facilitada. No publiques secretos.
          </p>
          <h4>Si falta acceso o no entiendes el dato</h4>
          <p>
            Marca «Bloqueada» o «En revisión», explica el impedimento y solicita la comprobación al
            responsable autorizado.
          </p>
          <h4>Error frecuente</h4>
          <p>{{ task().mistake }}</p>
          <h4>Glosario relacionado</h4>
          <p>
            Runtime: ejecuta PHP. SAPI: modo de integración. Evidencia: dato contrastable. Consulta
            el glosario en Ayuda.
          </p>
        </div>
      </div>
      <app-source-refs [ids]="task().sources" /><a
        class="text-link"
        routerLink="/aula"
        [queryParams]="{ lesson: lessonIndex() }"
        >Ver explicación guiada de esta etapa <app-icon name="book" /></a
    ></app-info-expander>
    <form (ngSubmit)="save()" class="task-form">
      <div class="two-grid">
        <div>
          <label [for]="'note-' + task().id">Qué observé / justificación / bloqueo</label
          ><textarea
            [id]="'note-' + task().id"
            [name]="'note-' + task().id"
            [(ngModel)]="note"
            maxlength="4000"
            rows="3"
            placeholder="Describe el dato o explica lo que falta."
            (ngModelChange)="saved.set(false)"
          ></textarea>
        </div>
        <div>
          <label [for]="'evidence-' + task().id">Referencia de evidencia</label
          ><textarea
            [id]="'evidence-' + task().id"
            [name]="'evidence-' + task().id"
            [(ngModel)]="evidence"
            maxlength="4000"
            rows="3"
            placeholder="Documento, registro o comprobación fechada. Sin datos sensibles."
            (ngModelChange)="saved.set(false)"
          ></textarea>
        </div>
      </div>
      <div class="task-actions">
        <div>
          <label [for]="'status-' + task().id">Estado</label
          ><select
            [id]="'status-' + task().id"
            [name]="'status-' + task().id"
            [(ngModel)]="status"
            (ngModelChange)="saved.set(false)"
          >
            @for (s of statuses; track s.id) {
              <option [value]="s.id">{{ s.label }}</option>
            }
          </select>
        </div>
        @if (p.mode() === 'demo') {
          <button type="button" class="text-button" (click)="fillDemo()">
            Cargar ejemplo ficticio
          </button>
        }
        <button class="button secondary" type="submit">
          <app-icon name="check" /> Guardar tarea
        </button>
      </div>
      <p class="field-help">
        Las notas se guardan al pulsar «Guardar tarea». Comprobada requiere observación y evidencia;
        No aplica y Bloqueada requieren motivo.
      </p>
      <p aria-live="polite" [class]="error() ? 'field-error' : 'success-text'">
        {{ error() || (saved() ? 'Tarea guardada.' : '') }}
      </p>
    </form>
  </article>`,
})
export class AuditTaskComponent {
  readonly task = input.required<TaskDefinition>();
  readonly p = inject(ProgressService);
  readonly statuses = STATUSES;
  status: TaskStatus = 'not-started';
  note = '';
  evidence = '';
  readonly error = signal('');
  readonly saved = signal(false);
  private signature = '';
  private lastMode = '';
  constructor() {
    effect(() => {
      const mode = this.p.mode();
      const t = this.p.get(this.task().id);
      const next = mode + this.task().id + JSON.stringify(t);
      if (next === this.signature) return;
      this.signature = next;
      this.status = t.status;
      this.note = t.note;
      this.evidence = t.evidence;
      this.error.set('');
      if (mode !== this.lastMode) this.saved.set(false);
      this.lastMode = mode;
    });
  }
  lessonIndex() {
    return ({ A: 1, B: 2, C: 3, D: 4, E: 5 } as Record<string, number>)[this.task().section] ?? 0;
  }
  current() {
    return this.p.get(this.task().id);
  }
  statusLabel(s: TaskStatus) {
    return STATUSES.find((x) => x.id === s)!.label;
  }
  save() {
    this.error.set(this.p.updateTask(this.task().id, this.status, this.note, this.evidence));
    this.saved.set(!this.error());
  }
  fillDemo() {
    this.note =
      'DEMO FICTICIA · ' +
      this.task().what +
      ' Ejercicio de documentación, sin acceso a Twinteach.';
    this.evidence =
      'SIMULADO · Ficha ' + this.task().id + ' · 26/10/2026 · ' + this.task().evidence;
    this.saved.set(false);
  }
}

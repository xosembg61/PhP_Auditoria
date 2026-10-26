import { Injectable, computed, inject, signal } from '@angular/core';
import { AuditMode, TaskStatus, TASKS, SECTIONS, STATUSES } from '../content/audit';
import { StorageService } from './storage';
import { REFERENCES, REVIEW_DATE } from '../content/references';
export interface TaskProgress {
  status: TaskStatus;
  note: string;
  evidence: string;
  updatedAt?: string;
}
export interface Workspace {
  tasks: Record<string, TaskProgress>;
  unlocks: Record<string, string>;
  chapters: number[];
  lab: string[];
}
export interface Notice {
  id: string;
  title: string;
  message: string;
  mode: AuditMode;
}
const empty = (): Workspace => ({ tasks: {}, unlocks: {}, chapters: [], lab: [] });
export function validWorkspace(v: unknown): v is Workspace {
  if (!v || typeof v !== 'object') return false;
  const s = v as Workspace;
  return (
    !!s.tasks &&
    typeof s.tasks === 'object' &&
    !Array.isArray(s.tasks) &&
    Object.entries(s.tasks).every(
      ([id, t]) =>
        TASKS.some((d) => d.id === id) &&
        t &&
        STATUSES.some((x) => x.id === t.status) &&
        typeof t.note === 'string' &&
        t.note.length <= 4000 &&
        typeof t.evidence === 'string' &&
        t.evidence.length <= 4000 &&
        (t.updatedAt === undefined || typeof t.updatedAt === 'string'),
    ) &&
    !!s.unlocks &&
    typeof s.unlocks === 'object' &&
    !Array.isArray(s.unlocks) &&
    Object.entries(s.unlocks).every(
      ([k, t]) => ['A', 'B', 'C', 'D', 'E', 'learning', 'lab'].includes(k) && typeof t === 'string',
    ) &&
    Array.isArray(s.chapters) &&
    s.chapters.every((n) => Number.isInteger(n) && n >= 0 && n < 6) &&
    new Set(s.chapters).size === s.chapters.length &&
    Array.isArray(s.lab) &&
    s.lab.every((n) => ['normal', 'suspicious', 'convergent'].includes(n))
  );
}
export function taskError(status: TaskStatus, note: string, evidence: string): string {
  if (status === 'verified' && (!note.trim() || !evidence.trim()))
    return 'Para «Comprobada» escribe una observación y la referencia de evidencia.';
  if ((status === 'not-applicable' || status === 'blocked') && !note.trim())
    return status === 'blocked'
      ? 'Describe el bloqueo y el siguiente paso.'
      : 'Justifica por qué no aplica.';
  return '';
}
export const isResolved = (t: TaskProgress | undefined) =>
  !!t &&
  ((t.status === 'verified' && !!t.note.trim() && !!t.evidence.trim()) ||
    (t.status === 'not-applicable' && !!t.note.trim()));
export function sectionState(id: string, tasks: Record<string, TaskProgress>) {
  const list = TASKS.filter((t) => t.section === id);
  return {
    done: list.filter((t) => isResolved(tasks[t.id])).length,
    total: list.length,
    complete:
      list.every((t) => isResolved(tasks[t.id])) &&
      list.some((t) => tasks[t.id]?.status === 'verified'),
  };
}
export function escapeHtml(s: string) {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  );
}
export function downloadFile(name: string, content: string, type: string) {
  const u = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement('a');
  a.href = u;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(u), 1000);
}
@Injectable({ providedIn: 'root' })
export class ProgressService {
  readonly storage = inject(StorageService);
  readonly detailedHelp = signal(
    this.storage.read<boolean>('help-detail', false, (v): v is boolean => typeof v === 'boolean'),
  );
  setHelpDetail(value: boolean) {
    this.detailedHelp.set(value);
    this.storage.write('help-detail', value);
  }
  readonly mode = signal<AuditMode>(
    this.storage.read<AuditMode>(
      'mode',
      'demo',
      (v): v is AuditMode => v === 'demo' || v === 'template',
    ),
  );
  readonly state = signal(this.load(this.mode()));
  readonly notice = signal<Notice | null>(null);
  private queue: Notice[] = [];
  readonly count = computed(() => Object.values(this.state().tasks).filter(isResolved).length);
  readonly verified = computed(
    () => Object.values(this.state().tasks).filter((t) => t.status === 'verified').length,
  );
  readonly percent = computed(() => Math.round((this.count() / TASKS.length) * 100));
  load(mode: AuditMode) {
    return this.storage.read('audit:' + mode, empty(), validWorkspace);
  }
  save() {
    this.storage.write('audit:' + this.mode(), this.state());
  }
  setMode(mode: AuditMode) {
    this.save();
    this.mode.set(mode);
    this.state.set(this.load(mode));
    this.storage.write('mode', mode);
    this.notice.set(null);
    this.queue = [];
  }
  get(id: string): TaskProgress {
    return this.state().tasks[id] ?? { status: 'not-started', note: '', evidence: '' };
  }
  section(id: string) {
    return sectionState(id, this.state().tasks);
  }
  updateTask(id: string, status: TaskStatus, note: string, evidence: string): string {
    if (!TASKS.some((t) => t.id === id) || !STATUSES.some((s) => s.id === status))
      return 'Tarea o estado no reconocido.';
    const error = taskError(status, note, evidence);
    if (error) return error;
    this.state.update((s) => ({
      ...s,
      tasks: {
        ...s.tasks,
        [id]: {
          status,
          note: note.trim(),
          evidence: evidence.trim(),
          updatedAt: new Date().toISOString(),
        },
      },
    }));
    const section = SECTIONS.find((s) => s.id === id[0])!;
    if (this.section(section.id).complete)
      this.unlock(section.id, section.achievement, section.message);
    this.save();
    return '';
  }
  unlock(id: string, title: string, message: string) {
    if (this.state().unlocks[id]) return;
    this.state.update((s) => ({ ...s, unlocks: { ...s.unlocks, [id]: new Date().toISOString() } }));
    this.announce({ id, title, message, mode: this.mode() });
    this.save();
  }
  announce(n: Notice) {
    if (this.notice()) this.queue.push(n);
    else this.notice.set(n);
  }
  dismiss() {
    this.notice.set(this.queue.shift() ?? null);
  }
  replay(id: string, title: string, message: string) {
    this.announce({ id, title, message, mode: this.mode() });
  }
  markChapter(index: number) {
    if (!this.state().chapters.includes(index)) {
      this.state.update((s) => ({ ...s, chapters: [...s.chapters, index] }));
      if (this.state().chapters.length === 6)
        this.unlock(
          'learning',
          'Investigador PHP2Shell',
          'Has completado los seis capítulos de aprendizaje.',
        );
      this.save();
    }
  }
  completeLab(id: string) {
    if (!this.state().lab.includes(id)) {
      this.state.update((s) => ({ ...s, lab: [...s.lab, id] }));
      if (this.state().lab.length === 3)
        this.unlock('lab', 'Analista de indicios', 'Has razonado los tres casos simulados.');
      this.save();
    }
  }
  resetMode() {
    this.state.set(empty());
    this.notice.set(null);
    this.queue = [];
    this.save();
  }
  clearAll() {
    this.storage.clear();
    this.detailedHelp.set(false);
    this.mode.set('demo');
    this.state.set(empty());
    this.notice.set(null);
    this.queue = [];
  }
  report() {
    return {
      schemaVersion: 1,
      mode: this.mode(),
      notice:
        this.mode() === 'demo'
          ? 'DEMO: todos los datos son ficticios. No corresponde a Twinteach.'
          : 'PLANTILLA: notas del visitante, no verificadas por esta aplicación.',
      generatedAt: new Date().toISOString(),
      contentReviewedAt: REVIEW_DATE,
      summary: { documented: this.count(), verified: this.verified(), total: TASKS.length },
      tasks: TASKS.map((t) => ({ ...t, progress: this.get(t.id) })),
      achievements: this.state().unlocks,
      chapters: this.state().chapters,
      sources: REFERENCES,
      limitations: 'La checklist no certifica la seguridad de ningún sistema.',
    };
  }
  exportJson() {
    downloadFile(
      'PHP2Shell_' + this.mode() + '_informe.json',
      JSON.stringify(this.report(), null, 2),
      'application/json',
    );
  }
  exportHtml() {
    const r = this.report();
    const rows = r.tasks
      .map(
        (t) =>
          '<tr><td>' +
          escapeHtml(t.id + ' · ' + t.title) +
          '</td><td>' +
          escapeHtml(STATUSES.find((s) => s.id === t.progress.status)!.label) +
          '</td><td>' +
          escapeHtml(t.progress.note) +
          '</td><td>' +
          escapeHtml(t.progress.evidence) +
          '</td><td>' +
          escapeHtml(t.progress.updatedAt ?? 'Sin editar') +
          '</td></tr>',
      )
      .join('');
    downloadFile(
      'PHP2Shell_' + this.mode() + '_informe.html',
      '<!doctype html><html lang="es"><meta charset="utf-8"><title>Informe PHP2Shell</title><style>body{font:15px system-ui;max-width:1200px;margin:40px auto;padding:20px;color:#14283c}table{border-collapse:collapse;width:100%;font-size:12px}td,th{border:1px solid #bac6d1;padding:8px;text-align:left;vertical-align:top;white-space:pre-wrap;overflow-wrap:anywhere}h1{font-size:28px}@media print{body{margin:0}}</style><h1>PHP2Shell · ' +
        this.mode().toUpperCase() +
        '</h1><p>' +
        escapeHtml(r.notice) +
        '</p><p>Generado: ' +
        escapeHtml(r.generatedAt) +
        ' · Revisión de contenido: ' +
        REVIEW_DATE +
        '</p><p>' +
        r.summary.documented +
        ' de ' +
        r.summary.total +
        ' tareas documentadas. ' +
        escapeHtml(r.limitations) +
        '</p><table><thead><tr><th>Tarea</th><th>Estado</th><th>Observación / motivo</th><th>Evidencia</th><th>Última edición</th></tr></thead><tbody>' +
        rows +
        '</tbody></table><h2>Fuentes</h2><ul>' +
        REFERENCES.map(
          (s) =>
            '<li><a href="' +
            escapeHtml(s.url) +
            '">' +
            escapeHtml(s.title) +
            '</a> · ' +
            escapeHtml(s.date) +
            '</li>',
        ).join('') +
        '</ul><p>Para imprimir: abrir este archivo y usar Ctrl+P.</p></html>',
      'text/html',
    );
  }
}

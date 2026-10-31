import { Component, ViewChild, computed, inject, signal } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProgressService, TaskProgress } from '../core/progress';
import { auditSummary } from '../core/audit-summary';
import { SECTIONS, TASKS, STATUSES, AuditMode } from '../content/audit';
import { PageHeaderComponent, IconComponent } from '../shared/ui';
import { AUDIT_WALKTHROUGHS } from '../content/walkthroughs';
import { AuditTaskComponent } from '../shared/audit-task';

@Component({
  imports: [RouterLink, PageHeaderComponent, IconComponent, AuditTaskComponent],
  templateUrl: './audit.html',
})
export class AuditPage {
  readonly p = inject(ProgressService);
  readonly sections = SECTIONS;
  readonly tasks = TASKS;
  readonly index = signal(0);
  readonly results = signal(false);
  readonly confirmReset = signal(false);
  readonly task = computed(() => TASKS[this.index()]);
  readonly section = computed(() =>
    SECTIONS.find((section) => section.id === this.task().section)!,
  );
  readonly sectionTasks = computed(() =>
    TASKS.filter((task) => task.section === this.task().section),
  );
  readonly sectionPosition = computed(
    () => this.sectionTasks().findIndex((task) => task.id === this.task().id) + 1,
  );
  readonly walkthrough = computed(() => AUDIT_WALKTHROUGHS[this.task().section]);
  readonly summary = computed(() => auditSummary(this.p.state().tasks));
  private readonly drafts = new Map<string, TaskProgress>();
  @ViewChild(AuditTaskComponent) private editor?: AuditTaskComponent;
  constructor() {
    this.index.set(this.firstPending());
    inject(ActivatedRoute)
      .queryParamMap.pipe(takeUntilDestroyed())
      .subscribe((params) => {
        const section = params.get('section');
        const index = TASKS.findIndex((task) => task.section === section);
        if (index >= 0) this.go(index);
      });
  }
  private firstPending() {
    const index = TASKS.findIndex((task) =>
      ['not-started', 'in-review', 'blocked'].includes(this.p.get(task.id).status),
    );
    return index >= 0 ? index : 0;
  }
  draft() {
    return this.drafts.get(this.p.mode() + ':' + this.task().id) ?? null;
  }
  private cacheDraft() {
    if (this.editor)
      this.drafts.set(this.p.mode() + ':' + this.task().id, this.editor.draftValue());
  }
  private focusCard() {
    setTimeout(() => {
      const heading = document.getElementById(
        this.results() ? 'audit-results-title' : 'audit-step-heading',
      );
      heading?.focus({ preventScroll: true });
      heading?.scrollIntoView?.({
        block: 'start',
        behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
          ? 'instant'
          : 'smooth',
      });
    });
  }
  go(index: number) {
    if (!Number.isInteger(index) || index < 0 || index >= TASKS.length) return;
    this.cacheDraft();
    this.results.set(false);
    this.index.set(index);
    this.focusCard();
  }
  chooseSection(id: string) {
    this.go(TASKS.findIndex((task) => task.section === id));
  }
  revisit(id: string) {
    this.go(TASKS.findIndex((task) => task.id === id));
  }
  saved(id: string) {
    this.drafts.delete(this.p.mode() + ':' + id);
    if (this.index() < TASKS.length - 1) {
      this.index.update((index) => index + 1);
      this.focusCard();
    } else this.showResults(false);
  }
  leavePending() {
    this.cacheDraft();
    if (this.index() < TASKS.length - 1) this.index.update((index) => index + 1);
    else this.results.set(true);
    this.focusCard();
  }
  showResults(cache = true) {
    if (cache) this.cacheDraft();
    this.results.set(true);
    this.focusCard();
  }
  changeMode(mode: AuditMode) {
    if (mode === this.p.mode()) return;
    this.cacheDraft();
    this.p.setMode(mode);
    this.index.set(this.firstPending());
    this.results.set(false);
    this.confirmReset.set(false);
  }
  statusLabel(status: string) {
    return STATUSES.find((item) => item.id === status)?.label ?? 'No iniciada';
  }
  reset() {
    const mode = this.p.mode();
    for (const key of this.drafts.keys()) if (key.startsWith(mode + ':')) this.drafts.delete(key);
    this.p.resetMode();
    this.index.set(0);
    this.results.set(false);
    this.confirmReset.set(false);
  }
}

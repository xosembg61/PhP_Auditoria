import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ProgressService } from '../core/progress';
import { SECTIONS, TASKS, STATUSES, AuditMode } from '../content/audit';
import { PageHeaderComponent, IconComponent, ProgressRingComponent } from '../shared/ui';
import { AuditTaskComponent } from '../shared/audit-task';
@Component({
  imports: [
    FormsModule,
    RouterLink,
    PageHeaderComponent,
    IconComponent,
    ProgressRingComponent,
    AuditTaskComponent,
  ],
  templateUrl: './audit.html',
})
export class AuditPage {
  readonly p = inject(ProgressService);
  readonly sections = SECTIONS;
  readonly statuses = STATUSES;
  readonly tasks = TASKS;
  readonly active = signal('A');
  readonly confirmReset = signal(false);
  constructor() {
    const q = inject(ActivatedRoute).snapshot.queryParamMap.get('section');
    if (SECTIONS.some((s) => s.id === q)) this.active.set(q!);
  }
  sectionTasks() {
    return TASKS.filter((t) => t.section === this.active());
  }
  currentSection() {
    return SECTIONS.find((s) => s.id === this.active())!;
  }
  changeMode(mode: string) {
    this.p.setMode(mode as AuditMode);
    this.confirmReset.set(false);
  }
  statusCount(id: string) {
    return (
      Object.values(this.p.state().tasks).filter((t) => t.status === id).length +
      (id === 'not-started' ? TASKS.length - Object.keys(this.p.state().tasks).length : 0)
    );
  }
  navigate(delta: number) {
    const i = SECTIONS.findIndex((s) => s.id === this.active());
    if (SECTIONS[i + delta]) this.active.set(SECTIONS[i + delta].id);
  }
  reset() {
    this.p.resetMode();
    this.confirmReset.set(false);
  }
}

import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  SCENARIOS,
  CONCLUSIONS,
  LabAnswer,
  evaluateScenario,
  LogEvent,
} from '../content/laboratory';
import { ProgressService } from '../core/progress';
import { PageHeaderComponent, IconComponent, SourceRefsComponent } from '../shared/ui';
const blank = (): LabAnswer => ({ selected: [], conclusion: '', justification: '', hint: 0 });
@Component({
  imports: [FormsModule, PageHeaderComponent, IconComponent, SourceRefsComponent],
  templateUrl: './lab.html',
})
export class LabPage {
  readonly p = inject(ProgressService);
  readonly scenarios = SCENARIOS;
  readonly Math = Math;
  readonly conclusions = CONCLUSIONS;
  readonly caseId = signal('normal');
  readonly search = signal('');
  readonly source = signal('ALL');
  readonly level = signal('ALL');
  readonly from = signal('');
  readonly until = signal('');
  readonly focused = signal('');
  readonly showContext = signal(false);
  readonly feedback = signal<ReturnType<typeof evaluateScenario> | null>(null);
  readonly attempts = signal<Record<string, LabAnswer>>({});
  readonly current = computed(() => SCENARIOS.find((s) => s.id === this.caseId())!);
  readonly answer = computed(() => this.attempts()[this.caseId()] ?? blank());
  readonly selectedEvent = computed(() =>
    this.current().events.find((e) => e.id === this.focused()),
  );
  readonly filtered = computed(() =>
    this.current().events.filter(
      (e) =>
        (this.source() === 'ALL' || e.source === this.source()) &&
        (this.level() === 'ALL' || e.level === this.level()) &&
        (!this.from() || e.timestamp.slice(11, 16) >= this.from()) &&
        (!this.until() || e.timestamp.slice(11, 16) <= this.until()) &&
        (e.message + ' ' + e.ip + ' ' + e.source)
          .toLowerCase()
          .includes(this.search().toLowerCase()),
    ),
  );
  readonly histogram = computed(() => {
    const counts: Record<string, number> = {};
    for (const e of this.current().events) {
      const m = e.timestamp.slice(11, 16);
      counts[m] = (counts[m] ?? 0) + 1;
    }
    const max = Math.max(...Object.values(counts));
    return Object.entries(counts).map(([minute, count]) => ({
      minute,
      count,
      height: (count / max) * 100,
    }));
  });
  constructor() {
    effect(() => {
      const mode = this.p.mode();
      this.attempts.set(
        this.p.storage.read<Record<string, LabAnswer>>(
          'laboratory:' + mode,
          {},
          (v): v is Record<string, LabAnswer> =>
            !!v &&
            typeof v === 'object' &&
            !Array.isArray(v) &&
            Object.entries(v).every(
              ([id, a]) =>
                SCENARIOS.some((s) => s.id === id) &&
                a &&
                Array.isArray(a.selected) &&
                a.selected.every(
                  (i: unknown) =>
                    typeof i === 'string' &&
                    SCENARIOS.find((s) => s.id === id)!.events.some((e) => e.id === i),
                ) &&
                typeof a.conclusion === 'string' &&
                typeof a.justification === 'string' &&
                a.justification.length <= 4000 &&
                Number.isInteger(a.hint) &&
                a.hint >= 0 &&
                a.hint <= 3,
            ),
        ),
      );
      this.feedback.set(null);
    });
  }
  choose(id: string) {
    this.caseId.set(id);
    this.focused.set('');
    this.search.set('');
    this.source.set('ALL');
    this.level.set('ALL');
    this.from.set('');
    this.until.set('');
    this.feedback.set(null);
  }
  update(change: Partial<LabAnswer>) {
    this.attempts.update((a) => ({ ...a, [this.caseId()]: { ...this.answer(), ...change } }));
    this.p.storage.write('laboratory:' + this.p.mode(), this.attempts());
    this.feedback.set(null);
  }
  toggle(id: string) {
    const ids = this.answer().selected;
    this.update({ selected: ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id] });
  }
  inspect(e: LogEvent) {
    this.focused.set(e.id);
  }
  context() {
    const i = this.current().events.findIndex((e) => e.id === this.focused());
    return this.current().events.slice(Math.max(0, i - 1), i + 2);
  }
  check() {
    const f = evaluateScenario(this.current(), this.answer());
    this.feedback.set(f);
    if (f.accepted) this.p.completeLab(this.caseId());
  }
  hint() {
    this.update({ hint: Math.min(3, this.answer().hint + 1) });
  }
  reset() {
    this.update(blank());
    this.focused.set('');
  }
}

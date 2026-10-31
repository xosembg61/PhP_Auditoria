import { describe, expect, it } from 'vitest';
import { auditSummary } from './audit-summary';
import { TASKS } from '../content/audit';
import { TaskProgress } from './progress';
describe('resultado de auditoría con límites', () => {
  it('distingue evidencia, no aplicación, bloqueo y pendientes sin sumar avances de pantalla', () => {
    const summary = auditSummary({
      A1: { status: 'verified', note: 'dato', evidence: 'referencia' },
      A2: { status: 'blocked', note: 'falta acceso', evidence: '' },
      A3: { status: 'not-applicable', note: 'fuera de alcance', evidence: '' },
      A4: { status: 'in-review', note: 'pendiente', evidence: '' },
    });
    expect([summary.verified, summary.notApplicable, summary.blocked, summary.pending]).toEqual([
      1, 1, 1, 15,
    ]);
    expect(summary.followups).toHaveLength(16);
    expect(summary.next).toContain('bloqueos');
  });
  it('una revisión formada solo por No aplica no se convierte en una revisión acreditada', () => {
    const tasks = Object.fromEntries(
      TASKS.map((task) => [
        task.id,
        { status: 'not-applicable', note: 'justificación', evidence: '' },
      ]),
    ) as Record<string, TaskProgress>;
    const summary = auditSummary(tasks);
    expect(summary.verified).toBe(0);
    expect(summary.notApplicable).toBe(18);
    expect(summary.title).toContain('necesita más evidencia');
  });
});

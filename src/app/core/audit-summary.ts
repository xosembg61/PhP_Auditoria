import { TASKS, SECTIONS } from '../content/audit';
import { TaskProgress, isResolved } from './progress';

export function auditSummary(tasks: Record<string, TaskProgress>) {
  const rows = TASKS.map((task) => ({
    ...task,
    progress: tasks[task.id] ?? ({ status: 'not-started', note: '', evidence: '' } as TaskProgress),
  }));
  const verified = rows.filter(
    (row) => row.progress.status === 'verified' && isResolved(row.progress),
  ).length;
  const notApplicable = rows.filter(
    (row) => row.progress.status === 'not-applicable' && isResolved(row.progress),
  ).length;
  const blocked = rows.filter((row) => row.progress.status === 'blocked').length;
  const pending = rows.length - verified - notApplicable - blocked;
  return {
    verified,
    notApplicable,
    blocked,
    pending,
    total: rows.length,
    title:
      verified + notApplicable === rows.length && verified > 0
        ? 'Revisión documentada'
        : verified === 0
          ? 'La conclusión necesita más evidencia'
          : 'Hay comprobaciones por cerrar',
    next:
      blocked > 0
        ? 'Pide al responsable los datos que faltan para resolver los bloqueos.'
        : pending > 0
          ? 'Retoma las comprobaciones pendientes y registra lo que puedas contrastar.'
          : verified === 0
            ? 'Revisa el alcance: no hay ninguna comprobación acreditada con evidencia.'
            : 'Revisa el informe, sus límites y el siguiente seguimiento con el responsable.',
    sections: SECTIONS.map((section) => ({
      ...section,
      verified: rows.filter(
        (row) =>
          row.section === section.id &&
          row.progress.status === 'verified' &&
          isResolved(row.progress),
      ).length,
      total: rows.filter((row) => row.section === section.id).length,
      open: rows.filter((row) => row.section === section.id && !isResolved(row.progress)).length,
    })),
    followups: rows.filter((row) => !isResolved(row.progress)),
  };
}

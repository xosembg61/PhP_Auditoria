import { describe, it, expect } from 'vitest';
import { LESSONS, EVIDENCE_DRILLS } from './learning';
import { refById } from './references';
import { simpleStudyGuide, detailedStudyReport } from '../core/study-reports';
import { PATCHES } from './incident';
import { TASKS } from './audit';
describe('material didáctico y fuentes', () => {
  it('las seis lecciones enlazan fuentes reales de la colección y ofrecen una pregunta resoluble', () => {
    expect(LESSONS).toHaveLength(6);
    for (const l of LESSONS) {
      expect(l.steps.length).toBeGreaterThanOrEqual(3);
      expect(l.sources.every((s) => !!refById(s))).toBe(true);
      expect(l.question.options.some((o) => o.id === l.question.correct)).toBe(true);
      expect(l.example.doesNot.length).toBeGreaterThan(30);
    }
  });
  it('mantiene separados el ejemplo documental de Ubuntu y los datos simulados', () => {
    const l = LESSONS.find((l) => l.id === 'backport')!;
    expect(l.example.label).toContain('Referencia oficial');
    expect(l.example.doesNot).toContain('No clasifica cualquier');
    expect(l.sources).toContain('ubuntu-state');
  });
  it('el informe sencillo comparte los mínimos de la fuente única', () => {
    const text = simpleStudyGuide();
    for (const v of Object.values(PATCHES)) expect(text).toContain(v);
    expect(text).toContain('23/10/2026');
  });
  it('el informe detallado incluye todas las tareas sin añadir scripts ejecutables', () => {
    const html = detailedStudyReport();
    for (const t of TASKS) expect(html).toContain(t.id + ' · ');
    expect(html).toContain('<html lang="es">');
    expect(html).toContain('Ejercicios resueltos');
    expect(html).not.toContain('<script');
  });
  it('los ejercicios no equiparan documentos de proveedor con runtime verificado', () => {
    const d = EVIDENCE_DRILLS.find((d) => d.id === 'vendor-proof')!;
    expect(d.answer).toBe('insufficient');
    expect(d.feedback).toContain('uso efectivo');
  });
});

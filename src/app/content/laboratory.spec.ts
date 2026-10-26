import { describe, it, expect } from 'vitest';
import { SCENARIOS, evaluateScenario } from './laboratory';
describe('laboratorio sintético', () => {
  it.each(SCENARIOS.map((s) => [s.id, s]))('acepta razonamiento estructurado de %s', (_, value) => {
    const s = value as (typeof SCENARIOS)[number];
    expect(
      evaluateScenario(s, {
        selected: s.anchors,
        conclusion: s.conclusion,
        justification:
          'Relaciono los eventos del caso; la atribución requiere evidencia adicional.',
        hint: 0,
      }).accepted,
    ).toBe(true);
  });
  it('rechaza atribuir una CVE por el color de una alerta', () =>
    expect(
      evaluateScenario(SCENARIOS[2], {
        selected: ['c4', 'c5'],
        conclusion: 'attributed',
        justification: 'Las alertas no bastan para atribuir la vulnerabilidad concreta.',
        hint: 0,
      }).title,
    ).toBe('Conclusión precipitada'));
  it('no omite las evidencias convergentes', () =>
    expect(
      evaluateScenario(SCENARIOS[2], {
        selected: ['c2'],
        conclusion: 'possible',
        justification: 'Necesitamos relacionar fuentes y descartar explicaciones alternativas.',
        hint: 0,
      }).accepted,
    ).toBe(false));
  it('calcula métricas sobre eventos locales con IP reservadas', () => {
    expect(SCENARIOS.map((s) => s.events.length)).toEqual([5, 6, 6]);
    expect(
      SCENARIOS.every((s) => s.events.every((e) => e.ip === '—' || e.ip === '192.0.2.10')),
    ).toBe(true);
  });
});

import { describe, it, expect } from 'vitest';
import {
  PLAN_QUESTIONS,
  PlanInput,
  validPlanInput,
  buildActionPlan,
  actionPlanMarkdown,
  supportRequestMarkdown,
} from './action-plan';
const base: PlanInput = {
  role: 'admin',
  environment: 'linux',
  patch: 'upstream',
  activity: 'none',
  coverage: 'documented',
};
describe('plan orientativo según el contexto', () => {
  it('no genera un diagnóstico con respuestas incompletas o ajenas al formulario', () => {
    expect(buildActionPlan({ ...base, patch: '' })).toEqual([]);
    expect(validPlanInput({ ...base, role: 'root-bypass' })).toBe(false);
    expect(validPlanInput(null)).toBe(false);
  });
  it('prioriza preservar y escalar actividad no autorizada antes del cambio', () => {
    const p = buildActionPlan({ ...base, activity: 'unauthorized' });
    expect(p[0].id).toBe('response');
    expect(p.findIndex((a) => a.id === 'patch')).toBeGreaterThan(0);
    expect(p[0].action).toContain('evidencia volátil');
  });
  it('dirige a un alumno al responsable, sin inventarle permisos', () => {
    const p = buildActionPlan({ ...base, role: 'learner' });
    expect(p[0].id).toBe('owner');
    expect(p[0].action).toContain('no inventes resultados');
  });
  it('no trata un backport documentado como comprobación automática del servicio', () => {
    const p = buildActionPlan({ ...base, patch: 'vendor' }).find((a) => a.id === 'patch')!;
    expect(p.action).toContain('no demuestra por sí sola');
    expect(p.evidence).toContain('revisión exactas');
  });
  it('adapta el procedimiento a réplicas e imágenes', () => {
    const p = buildActionPlan({ ...base, environment: 'container' });
    expect(p.find((a) => a.id === 'inventory')?.action).toContain('réplicas');
    expect(p.find((a) => a.id === 'verify')?.action).toContain('todas las réplicas');
  });
  it('mantiene los límites de cobertura sin convertir ausencia de indicios en garantía', () => {
    const p = buildActionPlan({ ...base, coverage: 'partial' }).find(
      (a) => a.id === 'investigate',
    )!;
    expect(p.action).toContain('falta de registros no prueba ausencia de ataque');
    expect(p.avoid).toContain('certificado');
  });
  it('todas las combinaciones válidas conservan inventario, parche, verificación, investigación y cierre', () => {
    let count = 0;
    for (const role of PLAN_QUESTIONS[0].options)
      for (const env of PLAN_QUESTIONS[1].options)
        for (const patch of PLAN_QUESTIONS[2].options)
          for (const activity of PLAN_QUESTIONS[3].options)
            for (const coverage of PLAN_QUESTIONS[4].options) {
              const p = buildActionPlan({
                role: role.id,
                environment: env.id,
                patch: patch.id,
                activity: activity.id,
                coverage: coverage.id,
              });
              expect(new Set(p.map((a) => a.id)).size).toBe(p.length);
              for (const id of ['inventory', 'patch', 'verify', 'investigate', 'document'])
                expect(p.some((a) => a.id === id)).toBe(true);
              count++;
            }
    expect(count).toBe(384);
  });
  it('exporta un plan condicionado y una solicitud que no se envía', () => {
    const report = actionPlanMarkdown({ ...base, role: 'learner' });
    expect(report).toContain('No es un diagnóstico');
    expect(report).toContain('Estoy aprendiendo');
    expect(actionPlanMarkdown({ ...base, patch: '' })).toBe('');
    expect(supportRequestMarkdown()).toContain('Esta aplicación no envía mensajes');
  });
});

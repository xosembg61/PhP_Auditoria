import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ProgressService, taskError, sectionState, validWorkspace, escapeHtml } from './progress';
import { TASKS } from '../content/audit';
describe('documentación y persistencia', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
  });
  it('requiere observación y evidencia para comprobar', () => {
    expect(taskError('verified', '', '')).not.toBe('');
    expect(taskError('verified', 'dato', '')).not.toBe('');
    expect(taskError('verified', 'dato', 'ref')).toBe('');
  });
  it('exige motivo en no aplica y bloqueada', () => {
    expect(taskError('not-applicable', '', '')).not.toBe('');
    expect(taskError('blocked', '', '')).not.toBe('');
  });
  it('no valida secciones vacías ni todo no aplica como logro', () => {
    const tasks = Object.fromEntries(
      TASKS.filter((t) => t.section === 'A').map((t) => [
        t.id,
        { status: 'not-applicable' as const, note: 'motivo', evidence: '' },
      ]),
    );
    expect(sectionState('A', {}).complete).toBe(false);
    expect(sectionState('A', tasks)).toMatchObject({ done: 4, complete: false });
  });
  it('desbloquea una sola vez y revierte el progreso', () => {
    const p = TestBed.inject(ProgressService);
    for (const t of TASKS.filter((t) => t.section === 'A'))
      p.updateTask(t.id, 'verified', 'dato', 'referencia');
    const date = p.state().unlocks['A'];
    expect(p.notice()?.title).toBe('Cartógrafo del sistema');
    expect(p.section('A').complete).toBe(true);
    p.dismiss();
    p.updateTask('A1', 'in-review', '', '');
    expect(p.section('A').complete).toBe(false);
    expect(p.count()).toBe(3);
    p.updateTask('A1', 'verified', 'dato', 'ref');
    expect(p.state().unlocks['A']).toBe(date);
    expect(p.notice()).toBe(null);
  });
  it('separa los modos y recupera datos tras reconstruir el servicio', () => {
    const p = TestBed.inject(ProgressService);
    p.updateTask('A1', 'verified', 'DEMO', 'ficticio');
    p.setMode('template');
    expect(p.count()).toBe(0);
    p.updateTask('A2', 'blocked', 'Falta acceso; pedir comprobación', '');
    p.setMode('demo');
    expect(p.get('A1').note).toBe('DEMO');
    expect(p.get('A2').status).toBe('not-started');
    TestBed.resetTestingModule();
    expect(TestBed.inject(ProgressService).count()).toBe(1);
  });
  it('descarta almacenamiento corrupto', () => {
    localStorage.setItem('php2shell:v1:audit:demo', '{broken');
    const p = TestBed.inject(ProgressService);
    expect(p.count()).toBe(0);
    expect(p.storage.warning()).not.toBe('');
  });
  it('valida tipos de los registros guardados', () => {
    expect(validWorkspace({ tasks: {}, unlocks: {}, chapters: [], lab: [] })).toBe(true);
    expect(
      validWorkspace({
        tasks: { A1: { status: 'verified', note: [], evidence: '' } },
        unlocks: {},
        chapters: [],
        lab: [],
      }),
    ).toBe(false);
  });
  it('el informe no mezcla modo ni certifica seguridad', () => {
    const p = TestBed.inject(ProgressService);
    p.setMode('template');
    expect(p.report().mode).toBe('template');
    expect(p.report().tasks.length).toBe(18);
    expect(p.report().limitations).toContain('no certifica');
  });
  it('escapa texto en informes HTML', () =>
    expect(escapeHtml('<script>"x"</script>')).toBe('&lt;script&gt;&quot;x&quot;&lt;/script&gt;'));
});

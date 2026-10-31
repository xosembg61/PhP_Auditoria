import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { routes } from '../app.routes';
import { ProgressService } from '../core/progress';

function enter(root: HTMLElement, selector: string, value: string, event = 'input') {
  const control = root.querySelector<HTMLInputElement>(selector)!;
  control.value = value;
  control.dispatchEvent(new Event(event));
}
async function start() {
  const h = await RouterTestingHarness.create('/auditoria');
  await h.fixture.whenStable();
  return h;
}
describe('auditoría en una caja por pasos', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
  });
  it('no avanza sin una decisión documentada ni al afirmar Comprobada sin evidencia', async () => {
    const h = await start(),
      root = h.routeNativeElement!;
    root.querySelector('form')!.dispatchEvent(new Event('submit'));
    await h.fixture.whenStable();
    expect(root.querySelector('.field-error')?.textContent).toContain('Elige un estado');
    enter(root, 'select', 'verified', 'change');
    enter(root, 'textarea', 'Observación de prueba');
    root.querySelector('form')!.dispatchEvent(new Event('submit'));
    await h.fixture.whenStable();
    expect(root.querySelector('.field-error')?.textContent).toContain('referencia de evidencia');
    expect(root.querySelector('.task-id')?.textContent).toContain('A1');
    expect(TestBed.inject(ProgressService).count()).toBe(0);
  });
  it('guarda la evidencia antes de pasar de la primera a la segunda comprobación', async () => {
    const h = await start(),
      root = h.routeNativeElement!;
    enter(root, 'select', 'verified', 'change');
    enter(root, 'textarea', 'Observación administrativa ficticia');
    enter(root, 'textarea[id^="evidence-"]', 'Referencia ficticia fechada');
    root.querySelector('form')!.dispatchEvent(new Event('submit'));
    await h.fixture.whenStable();
    expect(TestBed.inject(ProgressService).get('A1').status).toBe('verified');
    expect(root.querySelector('.task-id')?.textContent).toContain('A2');
    expect(root.querySelector('.wizard-step-top')?.textContent).toContain('2 de 4');
    expect(root.querySelectorAll('.audit-task')).toHaveLength(1);
  });
  it('dejar las 18 para después termina en resultados pendientes y permite retomar una tarea concreta', async () => {
    const h = await start(),
      root = h.routeNativeElement!;
    for (let i = 0; i < 18; i++) {
      root.querySelector<HTMLButtonElement>('.wizard-controls button:last-child')!.click();
      await h.fixture.whenStable();
    }
    expect(root.querySelector('.audit-results')).toBeTruthy();
    expect(root.querySelector('#audit-results-title')?.textContent).toContain(
      'necesita más evidencia',
    );
    expect(root.querySelector('.result-pending strong')?.textContent).toBe('18');
    expect(root.querySelector('.result-verified strong')?.textContent).toBe('0');
    root.querySelectorAll<HTMLButtonElement>('.results-followups button')[1].click();
    await h.fixture.whenStable();
    expect(root.querySelector('.task-id')?.textContent).toContain('A2');
    expect(TestBed.inject(ProgressService).count()).toBe(0);
  });
  it('conserva el borrador al volver y lo separa por modo sin marcarlo como comprobado', async () => {
    const h = await start(),
      root = h.routeNativeElement!;
    enter(root, 'textarea', 'Borrador de DEMO sin guardar');
    root.querySelector<HTMLButtonElement>('.wizard-controls button:last-child')!.click();
    await h.fixture.whenStable();
    root.querySelector<HTMLButtonElement>('.wizard-controls button:first-child')!.click();
    await h.fixture.whenStable();
    expect(root.querySelector<HTMLTextAreaElement>('textarea')!.value).toBe(
      'Borrador de DEMO sin guardar',
    );
    root.querySelectorAll<HTMLButtonElement>('.audit-topline button')[1].click();
    await h.fixture.whenStable();
    expect(root.querySelector<HTMLTextAreaElement>('textarea')!.value).toBe('');
    root.querySelectorAll<HTMLButtonElement>('.audit-topline button')[0].click();
    await h.fixture.whenStable();
    expect(root.querySelector<HTMLTextAreaElement>('textarea')!.value).toBe(
      'Borrador de DEMO sin guardar',
    );
    expect(TestBed.inject(ProgressService).count()).toBe(0);
  });
});

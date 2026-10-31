import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { routes } from '../app.routes';
import { ProgressService } from '../core/progress';
import { AUDIT_WALKTHROUGHS } from '../content/walkthroughs';

describe('explicaciones y recorrido continuo', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
  });
  it('muestra una tarea y explica el problema y la pregunta de las cinco etapas', async () => {
    const h = await RouterTestingHarness.create('/auditoria');
    await h.fixture.whenStable();
    const root = h.routeNativeElement!;
    expect(root.querySelector('#audit-problem')?.textContent).toContain('problema');
    const tabs = root.querySelectorAll<HTMLButtonElement>('.wizard-map nav button');
    expect(tabs).toHaveLength(5);
    for (let i = 0; i < tabs.length; i++) {
      tabs[i].click();
      await h.fixture.whenStable();
      expect(root.querySelector('.wizard-stage-intro')?.textContent).toContain(
        Object.values(AUDIT_WALKTHROUGHS)[i].question,
      );
      expect(root.querySelectorAll('.audit-task')).toHaveLength(1);
      expect(root.querySelectorAll('.task-purpose dt')).toHaveLength(2);
      expect(root.querySelectorAll('.wizard-stage-intro .plain-steps li')).toHaveLength(3);
    }
    expect(TestBed.inject(ProgressService).count()).toBe(0);
  });
  it('los seis capítulos están presentes a la vez y leer no acredita la auditoría', async () => {
    const h = await RouterTestingHarness.create('/guia');
    await h.fixture.whenStable();
    const root = h.routeNativeElement!;
    const chapters = root.querySelectorAll('.guide-chapter');
    expect(chapters).toHaveLength(6);
    for (const chapter of chapters) {
      expect(chapter.querySelector('.chapter-simple')?.textContent).toBeTruthy();
      expect(chapter.querySelectorAll('.chapter-steps li')).toHaveLength(3);
      expect(chapter.querySelector('.guide-limit')?.textContent).toBeTruthy();
    }
    root.querySelector<HTMLButtonElement>('.guide-chapter-end button')!.click();
    await h.fixture.whenStable();
    expect(TestBed.inject(ProgressService).state().chapters).toEqual([0]);
    expect(TestBed.inject(ProgressService).count()).toBe(0);
    expect(root.querySelectorAll('.guide-chapter')).toHaveLength(6);
    expect(root.querySelectorAll('app-learning-video')).toHaveLength(2);
  });
  it('los enlaces de búsqueda cambian la lección aunque el Aula ya esté abierta', async () => {
    const h = await RouterTestingHarness.create('/aula?lesson=0');
    await h.fixture.whenStable();
    await h.navigateByUrl('/aula?lesson=4');
    await h.fixture.whenStable();
    expect(h.routeNativeElement!.querySelector('.lesson-reader')?.textContent).toContain(
      'registros',
    );
  });
});

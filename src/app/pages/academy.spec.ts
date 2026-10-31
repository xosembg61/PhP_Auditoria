import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../app.routes';
import { ProgressService } from '../core/progress';
describe('aula práctica', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
  });
  it('admite enlace directo a una lección y muestra límites y fuentes', async () => {
    const h = await RouterTestingHarness.create('/aula?lesson=2');
    await h.fixture.whenStable();
    expect(h.routeNativeElement!.querySelector('.lesson-reader h2')?.textContent).toContain(
      'Leer versiones',
    );
    expect(h.routeNativeElement!.textContent).toContain('8.1.2-1ubuntu2.28');
    expect(h.routeNativeElement!.textContent).toContain('No clasifica cualquier');
  });
  it('la comprobación didáctica explica el error sin marcar auditoría', async () => {
    const h = await RouterTestingHarness.create('/aula');
    await h.fixture.whenStable();
    (h.routeNativeElement!.querySelector('.answer-options button') as HTMLButtonElement).click();
    await h.fixture.whenStable();
    expect(h.routeNativeElement!.textContent).toContain('Revisa el alcance');
    expect(TestBed.inject(ProgressService).count()).toBe(0);
  });
  it('genera un plan desde controles reales y lo invalida al cambiar respuestas', async () => {
    const h = await RouterTestingHarness.create('/aula?tab=plan');
    await h.fixture.whenStable();
    const root = h.routeNativeElement!;
    const choices = ['learner', 'hosting', 'vendor', 'anomaly', 'partial'];
    const selects = root.querySelectorAll('select');
    selects.forEach((s, i) => {
      s.value = choices[i];
      s.dispatchEvent(new Event('change'));
    });
    h.detectChanges();
    root.querySelector('form')!.dispatchEvent(new Event('submit'));
    await h.fixture.whenStable();
    expect(root.querySelectorAll('.action-plan>li').length).toBeGreaterThan(5);
    expect(TestBed.inject(ProgressService).count()).toBe(0);
    selects[2].value = 'unknown';
    selects[2].dispatchEvent(new Event('change'));
    await h.fixture.whenStable();
    expect(root.querySelector('.action-plan')).toBeNull();
  });
  it('ofrece dos materiales descargables y referencias con destino seguro', async () => {
    const h = await RouterTestingHarness.create('/aula?tab=resources');
    await h.fixture.whenStable();
    const root = h.routeNativeElement!;
    expect(root.querySelectorAll('.report-downloads a[download]')).toHaveLength(2);
    expect(root.querySelectorAll('.aula-video-resources app-learning-video')).toHaveLength(2);
  });
});

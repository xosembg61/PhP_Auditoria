import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../app.routes';
import { ProgressService } from '../core/progress';
describe('incidente ampliado', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
  });
  it('introduce términos, responsabilidades y límites de Twinteach', async () => {
    const h = await RouterTestingHarness.create('/incidente');
    await h.fixture.whenStable();
    const r = h.routeNativeElement!;
    expect(r.querySelectorAll('h1')).toHaveLength(1);
    expect(r.querySelectorAll('.incident-terms article')).toHaveLength(4);
    expect(r.textContent).toContain('Arquitectura conceptual, no inventario verificado');
    expect(r.querySelectorAll('.incident-faq details').length).toBeGreaterThan(5);
  });
  it('cambia entre el flujo normal y los dos fallos conservando su explicación y fuente', async () => {
    const h = await RouterTestingHarness.create('/incidente');
    await h.fixture.whenStable();
    const r = h.routeNativeElement!,
      buttons = r.querySelectorAll('.incident-flow-tabs button');
    expect(r.querySelectorAll('.incident-flow li')).toHaveLength(4);
    (buttons[1] as HTMLButtonElement).click();
    await h.fixture.whenStable();
    expect(r.querySelector('.incident-flow-panel')?.textContent).toContain('CVE-2026-109618');
    expect(r.querySelector('.incident-flow-panel')?.textContent).toContain('no prueba un ataque');
    (buttons[2] as HTMLButtonElement).click();
    await h.fixture.whenStable();
    expect(r.querySelector('.incident-flow-panel')?.textContent).toContain('CVE-2026-109619');
    expect(r.querySelector('.incident-flow-panel')?.textContent).toContain('use-after-free');
    expect(TestBed.inject(ProgressService).count()).toBe(0);
  });
  it('adapta la explicación al tipo de aplicación seleccionado', async () => {
    const h = await RouterTestingHarness.create('/incidente');
    await h.fixture.whenStable();
    const r = h.routeNativeElement!;
    (r.querySelectorAll('.ecosystem-branches button')[1] as HTMLButtonElement).click();
    await h.fixture.whenStable();
    expect(r.querySelector('.ecosystem-detail')?.textContent).toContain('alojamiento');
    expect(r.querySelector('.ecosystem-branches button[aria-pressed=true]')?.textContent).toContain(
      'CMS',
    );
  });
});

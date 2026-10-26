import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../app.routes';
describe('rutas de la aplicación', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
  });
  it.each([
    '/',
    '/incidente',
    '/cronologia',
    '/vulnerabilidades',
    '/versiones',
    '/guia',
    '/auditoria',
    '/laboratorio',
    '/conclusiones',
    '/fuentes',
    '/ayuda',
    '/aula',
    '/no-existe',
  ])('renderiza %s con un solo H1', async (path) => {
    const harness = await RouterTestingHarness.create(path);
    await harness.fixture.whenStable();
    expect(harness.routeNativeElement?.querySelectorAll('h1')).toHaveLength(1);
  });
  it('el comprobador reacciona a un formulario real', async () => {
    const h = await RouterTestingHarness.create('/versiones');
    await h.fixture.whenStable();
    const input = h.routeNativeElement!.querySelector('input')!;
    input.value = '8.3.9';
    input.dispatchEvent(new Event('input'));
    h.detectChanges();
    h.routeNativeElement!.querySelector('form')!.dispatchEvent(new Event('submit'));
    await h.fixture.whenStable();
    expect(h.routeNativeElement!.textContent).toContain('Anterior al parche oficial');
  });
});

import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, it, expect } from 'vitest';
import { App } from './app';
describe('estructura de navegación', () => {
  it('muestra rutas principales y enlace de salto', async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('a.skip-link')).toBeTruthy();
    expect(root.querySelector('main#contenido')).toBeTruthy();
    expect(root.querySelectorAll('nav a')).toHaveLength(6);
  });
});

import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AppearanceService, THEME_KEY } from './appearance';

describe('preferencia visual', () => {
  let systemDark = false;
  let change: (() => void) | undefined;
  beforeEach(() => {
    TestBed.resetTestingModule();
    localStorage.removeItem(THEME_KEY);
    systemDark = false;
    change = undefined;
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({
        get matches() {
          return systemDark;
        },
        addEventListener: (_: string, listener: () => void) => {
          change = listener;
        },
        removeEventListener: vi.fn(),
      })),
    );
  });
  afterEach(() => {
    TestBed.resetTestingModule();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    localStorage.removeItem(THEME_KEY);
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.style.colorScheme = '';
  });
  it('mantiene el modo claro inicial y recupera una elección guardada al volver', () => {
    const theme = TestBed.inject(AppearanceService);
    expect(theme.dark()).toBe(false);
    theme.toggle();
    expect(localStorage.getItem(THEME_KEY)).toBe('dark');
    expect(document.documentElement.dataset['theme']).toBe('dark');
    TestBed.resetTestingModule();
    expect(TestBed.inject(AppearanceService).dark()).toBe(true);
  });
  it('solo sigue los cambios del sistema cuando se elige automático', () => {
    const theme = TestBed.inject(AppearanceService);
    theme.setPreference('system');
    systemDark = true;
    change?.();
    expect(theme.dark()).toBe(true);
    theme.setPreference('light');
    change?.();
    expect(theme.dark()).toBe(false);
  });
  it('permite cambiar de tema aunque el navegador bloquee el almacenamiento', () => {
    const theme = TestBed.inject(AppearanceService);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(() => theme.toggle()).not.toThrow();
    expect(theme.dark()).toBe(true);
    expect(theme.storageNotice()).toContain('no permite guardarlo');
  });
  it('sincroniza otra pestaña y descarta preferencias desconocidas', () => {
    const theme = TestBed.inject(AppearanceService);
    window.dispatchEvent(new StorageEvent('storage', { key: THEME_KEY, newValue: 'dark' }));
    expect(theme.dark()).toBe(true);
    theme.setPreference('not-a-theme');
    expect(theme.preference()).toBe('dark');
    window.dispatchEvent(new StorageEvent('storage', { key: THEME_KEY, newValue: 'unexpected' }));
    expect(theme.dark()).toBe(false);
  });
});

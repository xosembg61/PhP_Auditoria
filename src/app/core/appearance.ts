import { DOCUMENT } from '@angular/common';
import { DestroyRef, Injectable, inject, signal } from '@angular/core';

export type ThemePreference = 'light' | 'dark' | 'system';
export const THEME_KEY = 'php2shell:theme';

@Injectable({ providedIn: 'root' })
export class AppearanceService {
  private readonly document = inject(DOCUMENT);
  private readonly view = this.document.defaultView;
  private readonly media = this.view?.matchMedia?.('(prefers-color-scheme: dark)');
  readonly preference = signal<ThemePreference>('light');
  readonly dark = signal(false);
  readonly storageNotice = signal('');

  constructor() {
    let preference: ThemePreference = 'light';
    try {
      const stored = this.view?.localStorage.getItem(THEME_KEY);
      if (stored === 'light' || stored === 'dark' || stored === 'system') preference = stored;
    } catch {
      /* The preference still works in memory. */
    }
    this.preference.set(preference);
    this.apply();
    const onSystemChange = () => {
      if (this.preference() === 'system') this.apply();
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key !== THEME_KEY && event.key !== null) return;
      const next = event.newValue;
      this.preference.set(next === 'dark' || next === 'system' ? next : 'light');
      this.apply();
    };
    this.media?.addEventListener('change', onSystemChange);
    this.view?.addEventListener('storage', onStorage);
    inject(DestroyRef).onDestroy(() => {
      this.media?.removeEventListener('change', onSystemChange);
      this.view?.removeEventListener('storage', onStorage);
    });
  }
  setPreference(value: string) {
    if (value !== 'light' && value !== 'dark' && value !== 'system') return;
    this.preference.set(value);
    this.apply();
    try {
      this.view?.localStorage.setItem(THEME_KEY, value);
      this.storageNotice.set('');
    } catch {
      this.storageNotice.set(
        'El tema funciona en esta pestaña; el navegador no permite guardarlo.',
      );
    }
  }
  toggle() {
    this.setPreference(this.dark() ? 'light' : 'dark');
  }
  private apply() {
    const dark =
      this.preference() === 'dark' || (this.preference() === 'system' && !!this.media?.matches);
    this.dark.set(dark);
    this.document.documentElement.dataset['theme'] = dark ? 'dark' : 'light';
    this.document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
    this.document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', dark ? '#101c2b' : '#d9e2dc');
  }
}

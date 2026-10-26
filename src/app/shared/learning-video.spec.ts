import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { LearningVideoComponent } from './learning-video';
describe('vídeos contextuales', () => {
  beforeEach(() => TestBed.resetTestingModule());
  it('no carga servicios externos antes de pulsar y permite retirar el reproductor', async () => {
    const f = TestBed.createComponent(LearningVideoComponent);
    f.componentRef.setInput('id', 'php-intro');
    await f.whenStable();
    const r = f.nativeElement as HTMLElement;
    expect(r.querySelector('iframe')).toBeNull();
    expect(r.querySelector('video')).toBeNull();
    (r.querySelector('button') as HTMLButtonElement).click();
    await f.whenStable();
    const src = r.querySelector('iframe')?.getAttribute('src');
    expect(src).toContain('youtube-nocookie.com/embed/a7_WFUlFS94');
    expect(src).not.toContain('autoplay');
    (r.querySelector('.hide-player') as HTMLButtonElement).click();
    await f.whenStable();
    expect(r.querySelector('iframe')).toBeNull();
  });
  it('un cambio de vídeo no conserva el reproductor del recurso anterior', async () => {
    const f = TestBed.createComponent(LearningVideoComponent);
    f.componentRef.setInput('id', 'discovery');
    await f.whenStable();
    (f.nativeElement.querySelector('button') as HTMLButtonElement).click();
    await f.whenStable();
    expect(f.nativeElement.querySelector('iframe')).toBeTruthy();
    f.componentRef.setInput('id', 'laravel-intro');
    await f.whenStable();
    expect(f.nativeElement.querySelector('iframe')).toBeNull();
    expect(f.nativeElement.textContent).toContain('Laravel in 100 Seconds');
  });
  it('un identificador desconocido no se convierte en una URL ejecutable', async () => {
    const f = TestBed.createComponent(LearningVideoComponent);
    f.componentRef.setInput('id', 'https://arbitrary.invalid/');
    await f.whenStable();
    expect(f.nativeElement.querySelector('iframe')).toBeNull();
    expect(f.nativeElement.querySelector('video')).toBeNull();
  });
  it('la grabación MP4 se carga solo al pulsar y ofrece controles sin autoplay', async () => {
    const f = TestBed.createComponent(LearningVideoComponent);
    f.componentRef.setInput('id', 'investigation');
    await f.whenStable();
    (f.nativeElement.querySelector('button') as HTMLButtonElement).click();
    await f.whenStable();
    const v = f.nativeElement.querySelector('video') as HTMLVideoElement;
    expect(v.controls).toBe(true);
    expect(v.autoplay).toBe(false);
    expect(v.preload).toBe('none');
    expect(v.querySelector('source')?.src).toContain('watchTowr');
  });
});

import { Component, input, computed, signal, effect, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LEARNING_VIDEOS } from '../content/media';
import { IconComponent } from './ui';
@Component({
  selector: 'app-learning-video',
  imports: [IconComponent],
  template: `@if (video(); as v) {
    <article class="learning-video" [class.compact-video]="compact()">
      <div [class]="'video-screen poster-' + v.poster">
        @if (!loaded()) {
          <div class="video-placeholder">
            <span class="video-kicker">{{
              v.kind === 'youtube' ? 'YOUTUBE' : 'SESIÓN INFORMATIVA'
            }}</span
            ><button (click)="loaded.set(true)" [attr.aria-label]="'Cargar vídeo: ' + v.title">
              <span class="play-symbol" aria-hidden="true">▶</span><span>Cargar vídeo</span></button
            ><small>{{ v.language }}</small>
          </div>
        } @else {
          @if (v.kind === 'youtube') {
            <iframe
              [src]="embedUrl()"
              [title]="v.title"
              loading="lazy"
              allow="encrypted-media; picture-in-picture; fullscreen"
              allowfullscreen
              referrerpolicy="strict-origin-when-cross-origin"
            ></iframe>
          } @else {
            <video controls preload="none" [attr.aria-label]="v.title">
              <source [src]="v.mediaUrl" type="video/mp4" />
              <a [href]="v.url">Ver en la fuente original</a>
            </video>
          }
          <button class="hide-player" (click)="loaded.set(false)">Ocultar reproductor</button>
        }
      </div>
      <div class="video-copy">
        <span class="eyebrow">PARA ENTENDER ESTA PARTE</span>
        <h3>{{ v.title }}</h3>
        <p>{{ v.purpose }}</p>
        <small class="video-byline">{{ v.author }} · {{ v.date }}</small>
        <details class="video-notes">
          <summary>Qué debes llevarte · explicación en español</summary>
          <p>{{ v.takeaway }}</p>
          <p>Nota de lectura propia; no es una transcripción ni una traducción del vídeo.</p>
        </details>
        <p class="field-help">
          El reproductor externo solo se carga al pulsar el botón. Necesita conexión. Si no se
          reproduce, abre la fuente.
        </p>
        <a class="text-link" [href]="v.source" target="_blank" rel="noopener noreferrer"
          >Abrir fuente original <app-icon name="external"
        /></a>
      </div>
    </article>
  }`,
})
export class LearningVideoComponent {
  readonly id = input.required<string>();
  readonly compact = input(false);
  readonly loaded = signal(false);
  readonly video = computed(() => LEARNING_VIDEOS.find((v) => v.id === this.id()));
  private readonly sanitizer = inject(DomSanitizer);
  readonly embedUrl = computed(() => {
    const v = this.video();
    return v?.kind === 'youtube' && v.videoId
      ? this.sanitizer.bypassSecurityTrustResourceUrl(
          'https://www.youtube-nocookie.com/embed/' + v.videoId + '?rel=0',
        )
      : null;
  });
  constructor() {
    effect(() => {
      this.id();
      this.loaded.set(false);
    });
  }
}

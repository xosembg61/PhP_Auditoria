import { Component, input, computed, signal, effect, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LEARNING_VIDEOS } from '../content/media';
import { IconComponent } from './ui';
@Component({
  selector: 'app-learning-video',
  imports: [IconComponent],
  template: `@if (video(); as v) {
    <article class="learning-video cinema-video" [class.compact-video]="compact()">
      <div [class]="'video-screen poster-' + v.poster">
        @if (!loaded()) {
          @if (v.kind === 'youtube' && !posterFailed()) {
            <img
              class="video-thumbnail"
              [src]="'https://i.ytimg.com/vi/' + v.videoId + '/hqdefault.jpg'"
              alt=""
              loading="lazy"
              referrerpolicy="no-referrer"
              (error)="posterFailed.set(true)"
            />
          }
          <div class="video-poster-shade" aria-hidden="true"></div>
          <span class="video-platform">{{
            v.kind === 'youtube' ? 'YouTube' : 'Sesión informativa'
          }}</span>
          <button
            type="button"
            class="video-launch"
            (click)="loaded.set(true)"
            [attr.aria-label]="'Cargar vídeo: ' + v.title"
          >
            <span class="play-symbol" aria-hidden="true">▶</span><span>Ver vídeo</span>
          </button>
          <span class="video-language">{{ v.language }}</span>
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
          } @else if (playbackFailed()) {
            <div class="video-fallback" role="status">
              <app-icon name="external" /><strong
                >Esta grabación necesita abrirse en su plataforma.</strong
              ><a class="button secondary" [href]="v.url" target="_blank" rel="noopener noreferrer"
                >Abrir grabación original</a
              >
            </div>
          } @else {
            <video
              controls
              preload="none"
              [attr.aria-label]="v.title"
              (error)="playbackFailed.set(true)"
            >
              <source [src]="v.mediaUrl" type="video/mp4" (error)="playbackFailed.set(true)" />
              <a [href]="v.url">Ver grabación original</a>
            </video>
          }
          <button type="button" class="hide-player" (click)="loaded.set(false)">
            Cerrar vídeo
          </button>
        }
      </div>
      <div class="video-copy">
        <div>
          <span class="eyebrow">UNA MIRADA PARA ENTENDERLO MEJOR</span>
          <h3>{{ v.title }}</h3>
          <small class="video-byline">{{ v.author }} · {{ v.date }}</small>
          <p>{{ v.purpose }}</p>
        </div>
        <div class="video-reading">
          <details class="video-notes">
            <summary>Qué debes llevarte</summary>
            <p>{{ v.takeaway }}</p>
            <small>Nota de lectura en español; no es una transcripción.</small>
          </details>
          <a class="text-link" [href]="v.url" target="_blank" rel="noopener noreferrer"
            >{{ v.kind === 'youtube' ? 'Abrir en YouTube' : 'Abrir grabación original' }}
            <app-icon name="external"
          /></a>
          <p class="field-help">
            El reproductor necesita conexión y se activa al pulsar. Puedes abrirlo en su plataforma
            si no se reproduce aquí.
          </p>
        </div>
      </div>
    </article>
  }`,
})
export class LearningVideoComponent {
  readonly id = input.required<string>();
  readonly compact = input(false);
  readonly loaded = signal(false);
  readonly posterFailed = signal(false);
  readonly playbackFailed = signal(false);
  readonly video = computed(() => LEARNING_VIDEOS.find((video) => video.id === this.id()));
  private readonly sanitizer = inject(DomSanitizer);
  readonly embedUrl = computed(() => {
    const video = this.video();
    return video?.kind === 'youtube' && video.videoId
      ? this.sanitizer.bypassSecurityTrustResourceUrl(
          'https://www.youtube-nocookie.com/embed/' + video.videoId + '?rel=0',
        )
      : null;
  });
  constructor() {
    effect(() => {
      this.id();
      this.loaded.set(false);
      this.playbackFailed.set(false);
      this.posterFailed.set(false);
    });
  }
}

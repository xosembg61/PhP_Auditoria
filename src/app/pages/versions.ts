import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PATCHES } from '../content/incident';
import { checkVersion, VersionResult } from '../core/version-checker';
import {
  PageHeaderComponent,
  IconComponent,
  InfoExpanderComponent,
  SourceRefsComponent,
} from '../shared/ui';
@Component({
  imports: [
    FormsModule,
    RouterLink,
    PageHeaderComponent,
    IconComponent,
    InfoExpanderComponent,
    SourceRefsComponent,
  ],
  template: `<div class="container page">
    <app-page-header
      eyebrow="Versiones"
      title="Comprueba la versión. Conoce sus límites."
      description="Comparación local de números upstream. No consulta tu servidor ni detecta backports del proveedor."
    />
    <div class="two-grid checker-grid">
      <form class="panel" (ngSubmit)="analyze()">
        <div class="panel-heading">
          <span class="module-icon"><app-icon name="shield" /></span>
          <div>
            <span class="eyebrow">REFERENCIA LOCAL</span>
            <h2>Comprobador de PHP</h2>
          </div>
        </div>
        <label for="branch">Rama de PHP</label
        ><select
          id="branch"
          [ngModel]="branch()"
          (ngModelChange)="branch.set($event); result.set(null)"
          name="branch"
        >
          <option value="auto">Detectar desde el número</option>
          @for (p of patches; track p.branch) {
            <option [value]="p.branch">PHP {{ p.branch }}</option>
          }
          <option value="legacy">PHP 8.1 o anterior</option></select
        ><label for="version">Versión exacta upstream</label
        ><input
          id="version"
          name="version"
          autocomplete="off"
          placeholder="Ej.: 8.3.35"
          [ngModel]="version()"
          (ngModelChange)="version.set($event); result.set(null)"
          aria-describedby="version-help version-error"
          [attr.aria-invalid]="version().trim() && validation().kind === 'invalid' ? 'true' : null"
        />
        <p id="version-help" class="field-help">
          Formato major.minor.patch. No pegues URLs ni direcciones de servidores.
        </p>
        <p id="version-error" class="field-error">
          @if (version().trim() && validation().kind === 'invalid') {
            {{ validation().detail }}
          }
        </p>
        <button
          class="button primary full"
          type="submit"
          [disabled]="!version().trim() || validation().kind === 'invalid'"
        >
          Comparar versión <app-icon name="arrow" />
        </button>
        <div class="example-buttons">
          <span>Prueba:</span>
          @for (v of examples; track v) {
            <button type="button" class="text-button mono" (click)="example(v)">{{ v }}</button>
          }
        </div>
      </form>
      <section class="panel result-panel" aria-live="polite">
        @if (result(); as r) {
          <span [class]="'result-icon ' + r.kind"
            ><app-icon [name]="r.kind === 'patched' ? 'shield' : 'alert'" /></span
          ><span class="eyebrow">PHP {{ version().trim() }}</span>
          <h2>{{ r.title }}</h2>
          <p>{{ r.detail }}</p>
          @if (r.patch) {
            <div class="version-reference">
              <span>Primera corrección de esta rama</span
              ><strong class="mono">{{ r.patch }}</strong>
            </div>
          }
          <div class="callout">
            <strong>Alcance del resultado</strong>
            <p>
              Solo compara el número escrito. Verifica el paquete, el runtime web, los procesos
              renovados y la configuración. No es una auditoría ni certificación.
            </p>
          </div>
          <a class="text-link" routerLink="/auditoria"
            >Documentar la comprobación <app-icon name="arrow"
          /></a>
        } @else {
          <span class="result-icon"><app-icon name="terminal" /></span
          ><span class="eyebrow">ESPERANDO TU VERSIÓN</span>
          <h2>Un número es el comienzo.</h2>
          <p>
            Introduce la versión para compararla con el parche de su rama. Después necesitarás
            comprobar qué ejecuta realmente el servicio web.
          </p>
          <span class="badge">Sin conexiones remotas</span>
        }
      </section>
    </div>
    <div class="callout warning update-notice">
      <strong>Seguimiento oficial · 23 de octubre de 2026</strong>
      <p>
        PHP recomienda desactivar administrativamente
        <code>session.upload_progress.enabled</code> hasta la siguiente corrección para cubrir un
        vector RCE poco habitual. Requiere una combinación concreta de serializadores de sesión y
        cambios en ejecución. Las aplicaciones que nunca cambian el serializador en ejecución pueden
        mantener la función, según el aviso. El responsable debe comprobar si aplica y renovar los
        procesos pertinentes.
      </p>
      <app-source-refs [ids]="['php']" />
    </div>
    <section class="section-space">
      <div class="section-heading">
        <div>
          <span class="eyebrow">PARCHE INICIAL · 21 OCTUBRE 2026</span>
          <h2>Primeras versiones oficiales corregidas</h2>
        </div>
        <span class="badge">No equivale a «últimas versiones»</span>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Rama</th>
              <th>Primera corregida</th>
              <th>Anterior a ese parche</th>
            </tr>
          </thead>
          <tbody>
            @for (p of patches; track p.branch) {
              <tr>
                <td class="mono">PHP {{ p.branch }}</td>
                <td>
                  <span class="badge success mono">{{ p.version }}</span>
                </td>
                <td>Revisar corrección upstream o backport del proveedor</td>
              </tr>
            }
            <tr>
              <td>8.1 y anteriores</td>
              <td>Sin nueva publicación oficial de la rama</td>
              <td>Proveedor LTS / migración; parches fuente mínimos para 7.4, 8.0 y 8.1</td>
            </tr>
          </tbody>
        </table>
      </div>
      <app-source-refs [ids]="['php', 'oom', 'state']" />
    </section>
    <div class="two-grid section-space">
      <app-info-expander title="¿Qué es un backport?"
        ><p>
          Un proveedor puede incorporar la corrección manteniendo un número base anterior. Necesitas
          la revisión exacta del paquete y su aviso o changelog. Este comprobador no detecta esa
          situación.
        </p></app-info-expander
      ><app-info-expander title="¿Por qué php -v no demuestra el runtime web?"
        ><p>
          Ese comando consulta el ejecutable de consola. PHP-FPM, Apache o un contenedor pueden usar
          otro. Identifica el servicio HTTP y consulta su paquete con herramientas administrativas
          autorizadas.
        </p></app-info-expander
      >
    </div>
  </div>`,
})
export class VersionsPage {
  readonly branch = signal('auto');
  readonly version = signal('');
  readonly result = signal<VersionResult | null>(null);
  readonly patches = Object.entries(PATCHES).map(([branch, version]) => ({ branch, version }));
  readonly examples = ['8.3.35', '8.3.36', '8.1.33'];
  readonly validation = computed(() => checkVersion(this.version(), this.branch()));
  analyze() {
    this.result.set(this.validation());
  }
  example(v: string) {
    this.branch.set('auto');
    this.version.set(v);
    this.analyze();
  }
}

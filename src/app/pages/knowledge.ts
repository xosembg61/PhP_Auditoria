import { Component, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeaderComponent, IconComponent, InfoExpanderComponent } from '../shared/ui';
import { TIMELINE } from '../content/incident';
import { REFERENCES, GLOSSARY } from '../content/references';
import { ProgressService } from '../core/progress';
import { MEDIA_CREDITS, LEARNING_VIDEOS } from '../content/media';
import { AppearanceService } from '../core/appearance';
const ui = [RouterLink, PageHeaderComponent, IconComponent];
@Component({
  imports: ui,
  template: `<div class="container page">
    <app-page-header
      eyebrow="Cronología"
      title="El parche no fue el principio."
      description="Una investigación de varios años, seguida de divulgación y actividad observada. Selecciona un hito para consultar el contexto."
    />
    <div class="timeline-layout">
      <div class="timeline-list" aria-label="Hitos del incidente">
        @for (t of timeline; track t.title; let i = $index) {
          <button
            [class.active]="index() === i"
            (click)="index.set(i)"
            [attr.aria-pressed]="index() === i"
          >
            <span class="timeline-node"></span><span class="mono">{{ t.date }}</span
            ><strong>{{ t.title }}</strong>
          </button>
        }
      </div>
      <article class="panel timeline-detail">
        <span class="badge">{{ current().kind }}</span>
        <div class="timeline-date mono">{{ current().date }}</div>
        <h2>{{ current().title }}</h2>
        <p>{{ current().text }}</p>

        <div class="callout">
          <strong>Lee el hecho con su alcance.</strong>
          <p>
            La fecha de divulgación no marca necesariamente el primer intento. La telemetría de un
            señuelo no acredita compromiso de sistemas ajenos.
          </p>
        </div>
        <a class="text-link" routerLink="/laboratorio"
          >Practicar interpretación de indicios <app-icon name="arrow"
        /></a>
      </article>
    </div>
    <figure class="timeline-photo">
      <img
        src="assets/images/servidores-nersc.jpg"
        alt="Racks de servidores, imagen de contexto"
        loading="lazy"
      />
      <figcaption>
        Una investigación conecta hechos, fechas y contextos. Fotografía de contexto; no corresponde
        a Twinteach.
      </figcaption>
    </figure>
  </div>`,
})
export class TimelinePage {
  readonly timeline = TIMELINE;
  readonly index = signal(6);
  current() {
    return this.timeline[this.index()];
  }
}
@Component({
  imports: ui,
  template: `<div class="container page">
    <app-page-header
      eyebrow="Vulnerabilidades"
      title="Qué ocurre dentro del intérprete."
      description="Dos causas técnicas relacionadas con memoria y ciclo de petición. CVSS 4.0: 9,2 para cada vulnerabilidad."
    />
    <div class="segmented" aria-label="Profundidad de explicación">
      <button (click)="technical.set(false)" [attr.aria-pressed]="!technical()">
        Explicación sencilla</button
      ><button (click)="technical.set(true)" [attr.aria-pressed]="technical()">
        Explicación técnica
      </button>
    </div>
    <div class="two-grid cve-grid">
      <article class="panel">
        <div class="split">
          <span class="badge critical">CVE-2026-109618</span
          ><strong class="critical-text">9,2 / 10</strong>
        </div>
        <h2>OOM y estado inconsistente</h2>
        <p>
          Al agotarse la memoria, algunas estructuras internas podían quedar incompletas. La
          limpieza de la petición podía usarlas como si fueran válidas.
        </p>
        <div class="flow-steps">
          <span>Petición</span><span>Agotamiento de memoria</span><span>Estado incompleto</span
          ><span>Limpieza insegura</span>
        </div>
        @if (technical()) {
          <p>
            Una salida anticipada podía interrumpir operaciones internas sin restaurar invariantes.
            El aviso distingue condiciones según la SAPI y rutas de aplicación. Consulta el advisory
            para el estado técnico actualizado.
          </p>
        }
      </article>
      <article class="panel">
        <div class="split">
          <span class="badge critical">CVE-2026-109619</span
          ><strong class="critical-text">9,2 / 10</strong>
        </div>
        <h2>Estado global obsoleto</h2>
        <p>
          Un proceso podía conservar referencias a memoria de una petición ya terminada. Una
          petición posterior podía volver a utilizarlas.
        </p>
        <div class="flow-steps">
          <span>Petición A</span><span>Referencia retenida</span><span>Memoria liberada</span
          ><span>Petición B</span>
        </div>
        @if (technical()) {
          <p>
            Es un use-after-free entre peticiones atendidas por el mismo worker: una operación
            produce estado persistente y otra lo consume antes de reinicializarlo.
          </p>
        }
      </article>
    </div>
    <div class="callout warning">
      <strong>Las condiciones importan.</strong>
      <p>
        No se deduce el compromiso de una aplicación por su nombre o por usar PHP. La actualización
        del runtime es la medida principal; los controles de aplicación son complementarios.
      </p>
    </div>
    <section class="section-space">
      <h2>Comprueba la idea clave</h2>
      <p>
        Angular está actualizado, pero no has verificado PHP. ¿Ha desaparecido el riesgo del
        backend?
      </p>
      <div class="button-row">
        <button class="button secondary" (click)="answer.set('yes')">Sí</button
        ><button class="button secondary" (click)="answer.set('no')">No</button>
      </div>
      @if (answer()) {
        <p class="callout" aria-live="polite">
          {{ answer() === 'no' ? 'Correcto.' : 'Revisa esa conclusión.' }} El frontend actualizado
          no prueba que el intérprete del backend tenga el parche.
        </p>
      }
      <a class="button primary" routerLink="/versiones"
        >Comprobar una versión <app-icon name="arrow"
      /></a>
    </section>
  </div>`,
})
export class VulnerabilitiesPage {
  readonly technical = signal(false);
  readonly answer = signal('');
}
@Component({
  imports: ui,
  template: `<div class="container page">
    <app-page-header
      eyebrow="Conclusiones"
      title="Primero, evidencia. Después, conclusiones."
      description="El resultado útil de esta investigación es un método de revisión, no una etiqueta de «sistema seguro»."
    />
    <div class="conclusion-list">
      @for (c of conclusions; track c.title; let i = $index) {
        <article>
          <span class="mono">0{{ i + 1 }}</span>
          <div>
            <h2>{{ c.title }}</h2>
            <p>{{ c.text }}</p>
          </div>
        </article>
      }
    </div>

    <div class="panel action-panel">
      <span class="eyebrow">QUÉ HARÍA PRIMERO UN RESPONSABLE</span>
      <h2>Localizar → corregir → verificar → investigar.</h2>
      <p>
        Priorizar los runtimes expuestos, acreditar el paquete corregido y los procesos renovados,
        revisar cada entorno y preservar registros desde al menos el 17 de octubre cuando exista
        cobertura. Aplicar también el seguimiento oficial del día 23.
      </p>
      <a class="button primary" routerLink="/auditoria"
        >Documentar la revisión <app-icon name="arrow"
      /></a>
    </div>
  </div>`,
})
export class ConclusionsPage {
  readonly conclusions = [
    {
      title: 'La dependencia común es PHP',
      text: 'Frameworks, CMS, APIs y desarrollos propios comparten el intérprete; Laravel es el caso práctico de esta guía.',
    },
    {
      title: 'El parche debe estar realmente en uso',
      text: 'La versión de consola o una instalación terminada no bastan para comprobar el runtime del servicio web.',
    },
    {
      title: 'Una auditoría necesita evidencias',
      text: 'Inventario, estado del parche, defensas, registros y limitaciones deben poder revisarse.',
    },
    {
      title: 'La ausencia de alertas tiene límites',
      text: 'Sin cobertura suficiente no puede descartarse una intrusión. Una anomalía tampoco atribuye por sí sola PHP2Shell.',
    },
  ];
}
@Component({
  imports: [PageHeaderComponent, IconComponent],
  template: `<div class="container page">
    <app-page-header
      eyebrow="Fuentes"
      title="Información que puedes contrastar."
      description="Fuentes primarias y fecha de revisión: 26 de octubre de 2026. Los datos de ejemplo de esta web son sintéticos."
    />
    <div class="callout warning">
      <strong>Actualización respecto al documento de diseño.</strong>
      <p>
        Se ha incorporado el aviso PHP del 23 de octubre. Las cuatro versiones de la tabla son las
        primeras corregidas el día 21; no se presentan como las últimas disponibles ni como garantía
        universal.
      </p>
    </div>
    <div class="sources-list">
      @for (s of sources; track s.id) {
        <article class="panel source-card">
          <div>
            <span class="eyebrow">{{ s.org }} · {{ s.date }}</span>
            <h2>{{ s.title }}</h2>
            <p>{{ s.supports }}</p>
          </div>
          <a class="button secondary" [href]="s.url" target="_blank" rel="noopener noreferrer"
            >Abrir fuente <app-icon name="external"
          /></a>
        </article>
      }
    </div>
    <section class="section-space">
      <h2>Qué conocemos de Twinteach</h2>
      <p><strong>Dato del enunciado:</strong> Angular en el frontend y Laravel en el backend.</p>
      <p>
        <strong>No verificado:</strong> versiones, proveedor, parches, configuración, registros y
        posible compromiso. Esta aplicación no ha accedido a sus sistemas.
      </p>
      <p>
        <strong>Regla editorial:</strong> las referencias técnicas se reúnen en esta página; las
        recomendaciones de procedimiento se presentan como guía; los registros del laboratorio son
        inventados.
      </p>
    </section>
    <section class="section-space">
      <span class="eyebrow">VÍDEOS DEL RECORRIDO</span>
      <h2>Siete recursos, distintas miradas.</h2>
      <p>
        Las explicaciones introductorias y los análisis del incidente tienen propósitos diferentes.
        Cada recurso indica su contexto.
      </p>
      <div class="media-reference-list">
        @for (v of videos; track v.id) {
          <a [href]="v.source" target="_blank" rel="noopener noreferrer"
            ><strong>{{ v.title }} <app-icon name="external" /></strong
            ><small>{{ v.author }} · {{ v.language }}</small>
            <p>{{ v.purpose }}</p></a
          >
        }
      </div>
    </section>
    <section class="section-space">
      <h2>Créditos de las imágenes</h2>
      <div class="two-grid">
        @for (c of credits; track c.local) {
          <figure class="panel credited-photo">
            <img [src]="c.local" [alt]="c.title" loading="lazy" />
            <figcaption>
              <strong>{{ c.title }}</strong>
              <p>{{ c.note }}</p>
              <a [href]="c.url" target="_blank" rel="noopener noreferrer">{{ c.author }}</a> ·
              <a [href]="c.licenseUrl" target="_blank" rel="noopener noreferrer">{{ c.license }}</a>
            </figcaption>
          </figure>
        }
      </div>
      <p>
        Logotipo PHP: Colin Viebrock, CC BY-SA 4.0, sin modificar. Fotografías de contexto: no son
        Twinteach ni evidencias del incidente.
      </p>
    </section>
    <section class="panel section-space uiverse-credits">
      <h2>Componentes visuales de Uiverse</h2>
      <p>
        Interruptor de tema adaptado del diseño de
        <a
          href="https://uiverse.io/JkHuger/itchy-turtle-45"
          target="_blank"
          rel="noopener noreferrer"
          >JkHuger</a
        >. Botón de regreso al inicio adaptado del diseño de
        <a
          href="https://uiverse.io/vinodjangid07/afraid-falcon-17"
          target="_blank"
          rel="noopener noreferrer"
          >Vinod Jangid</a
        >.
      </p>
      <p>
        Tarjetas adaptadas de
        <a
          href="https://uiverse.io/Smit-Prajapati/great-bat-98"
          target="_blank"
          rel="noopener noreferrer"
          >Smit-Prajapati</a
        >
        y botón de reproducción y acabado de botones adaptados de
        <a
          href="https://uiverse.io/adamgiebl/wise-moth-35"
          target="_blank"
          rel="noopener noreferrer"
          >Adam Giebl</a
        >. Se conservan las licencias MIT y los créditos de cada autor.
      </p>
    </section>
  </div>`,
})
export class SourcesPage {
  readonly videos = LEARNING_VIDEOS;
  readonly credits = MEDIA_CREDITS;
  readonly sources = REFERENCES;
}
@Component({
  imports: [PageHeaderComponent, InfoExpanderComponent],
  template: `<div class="container page">
    <app-page-header
      eyebrow="Ayuda"
      title="Los términos, sin ruido."
      description="Glosario, evidencias y estados para recorrer la guía con criterio."
    />
    <div class="two-grid">
      <article class="panel">
        <h2>¿Qué cuenta como evidencia?</h2>
        <p>
          Un dato que otra persona pueda contrastar: paquete exacto, referencia del proveedor,
          comprobación administrativa fechada o registro preservado. «Creo que está al día» es una
          suposición.
        </p>
        <p>
          No pegues contraseñas, tokens, direcciones privadas ni registros con datos personales.
          Anota referencias saneadas.
        </p>
      </article>
      <article class="panel">
        <h2>DEMO y PLANTILLA</h2>
        <p>
          <strong>DEMO:</strong> aprendizaje con datos ficticios. Los ejemplos no pertenecen a
          Twinteach.
        </p>
        <p>
          <strong>PLANTILLA:</strong> parte vacía para una revisión autorizada. Las notas las aporta
          el visitante; la web no las verifica.
        </p>
      </article>
    </div>
    <section class="section-space">
      <h2>Estados de auditoría</h2>
      <div class="callout">
        <p>
          <strong>No iniciada / En revisión:</strong> pendientes.
          <strong>Comprobada:</strong> necesita observación y evidencia.
          <strong>No aplica:</strong> exige justificación. <strong>Bloqueada:</strong> exige
          describir el impedimento y siguiente acción.
        </p>
        <p>
          El progreso cuenta tareas comprobadas o justificadas como no aplicables. Una sección con
          todo «No aplica» no desbloquea el logro de comprobación.
        </p>
      </div>
    </section>
    <section class="panel section-space">
      <h2>Preferencias y progreso local</h2>
      <div class="appearance-settings">
        <label for="theme-preference">Aspecto de la web</label>
        <select
          id="theme-preference"
          [value]="appearance.preference()"
          (change)="appearance.setPreference($any($event.target).value)"
        >
          <option value="light">Claro</option>
          <option value="dark">Oscuro</option>
          <option value="system">Automático · seguir el sistema</option>
        </select>
        <p class="field-help">
          El botón de sol y luna cambia el tema al instante. La elección se conserva al volver. En
          automático, la web sigue el aspecto del dispositivo.
        </p>
        @if (appearance.storageNotice()) {
          <p role="status">{{ appearance.storageNotice() }}</p>
        }
      </div>
      <button class="button secondary" (click)="p.setHelpDetail(!p.detailedHelp())">
        {{ p.detailedHelp() ? 'Cerrar ayudas por defecto' : 'Abrir ayudas ampliadas por defecto' }}
      </button>
      <p class="field-help">La preferencia se conserva en este navegador.</p>
      @if (!confirmClear()) {
        <button class="text-button critical-text" (click)="confirmClear.set(true)">
          Borrar mi progreso de ambos modos
        </button>
      } @else {
        <p>
          Se borrarán tareas, capítulos, laboratorio y ayudas de esta aplicación. La elección de
          tema se conserva.
        </p>
        <div class="button-row">
          <button class="button danger" (click)="p.clearAll(); confirmClear.set(false)">
            Sí, borrar mi progreso</button
          ><button class="button secondary" (click)="confirmClear.set(false)">Cancelar</button>
        </div>
      }
    </section>
    <section class="section-space">
      <h2>Glosario</h2>
      <div class="glossary">
        @for (g of glossary; track g[0]) {
          <app-info-expander [title]="g[0]"
            ><p>{{ g[1] }}</p></app-info-expander
          >
        }
      </div>
    </section>
  </div>`,
})
export class HelpPage {
  readonly appearance = inject(AppearanceService);
  readonly glossary = GLOSSARY;
  readonly p = inject(ProgressService);
  readonly confirmClear = signal(false);
}
@Component({
  imports: [RouterLink, IconComponent],
  template: `<div class="container page empty-page">
    <span class="eyebrow">404 / RUTA NO ENCONTRADA</span>
    <h1>Este camino no está en el mapa.</h1>
    <p>Elige un módulo desde la navegación o vuelve al inicio.</p>
    <a class="button primary" routerLink="/">Volver al inicio <app-icon name="arrow" /></a>
  </div>`,
})
export class NotFoundPage {}

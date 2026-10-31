import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent, PageHeaderComponent, InfoExpanderComponent } from '../shared/ui';
import { LearningVideoComponent } from '../shared/learning-video';
import { INCIDENT_FLOWS, INCIDENT_TERMS, INCIDENT_FAQ } from '../content/incident-explainer';
@Component({
  imports: [
    RouterLink,
    IconComponent,
    PageHeaderComponent,

    InfoExpanderComponent,
    LearningVideoComponent,
  ],
  templateUrl: './incident.html',
})
export class IncidentPage {
  readonly terms = INCIDENT_TERMS;
  readonly flows = INCIDENT_FLOWS;
  readonly faqs = INCIDENT_FAQ;
  readonly flowId = signal('normal');
  readonly flow = computed(() => INCIDENT_FLOWS.find((f) => f.id === this.flowId())!);
  readonly selected = signal('Frameworks');
  readonly ecosystem = [
    {
      name: 'Frameworks',
      examples: 'Laravel · Symfony · CodeIgniter',
      icon: 'layers',
      check: 'Identifica el PHP del backend y quién lo mantiene.',
      trap: 'Actualizar el framework no acredita el parche del intérprete.',
    },
    {
      name: 'CMS',
      examples: 'WordPress · Drupal · Joomla',
      icon: 'file',
      check: 'Consulta el runtime del alojamiento, además del CMS y los plugins.',
      trap: 'La pantalla de actualización del CMS no prueba qué PHP está instalado.',
    },
    {
      name: 'Tiendas',
      examples: 'Magento · PrestaShop · WooCommerce',
      icon: 'lock',
      check: 'Relaciona tienda, servicios y tareas auxiliares con sus runtimes.',
      trap: 'No presupongas el estado del servidor por la versión de la tienda.',
    },
    {
      name: 'Código propio',
      examples: 'APIs · paneles · PHP nativo',
      icon: 'code',
      check: 'Revisa el runtime efectivo del servicio que ejecuta ese código.',
      trap: 'No usar un framework no elimina la dependencia del intérprete.',
    },
    {
      name: 'Auxiliares',
      examples: 'Colas · tareas · CLI',
      icon: 'terminal',
      check: 'Incluye workers y tareas; su vía de exposición puede ser distinta.',
      trap: 'Una consola no representa a todos los procesos.',
    },
  ];
  readonly selection = computed(() => this.ecosystem.find((e) => e.name === this.selected())!);
  readonly concepts = [
    {
      title: 'Descubrimiento',
      text: 'Identificar y estudiar un fallo. Un primer indicio no equivale a conocer todas sus rutas de explotación.',
    },
    {
      title: 'Divulgación',
      text: 'Hacer pública la información, después de la investigación y, a veces, de intentos de ataque.',
    },
    {
      title: 'Intento observado',
      text: 'Detectar actividad compatible con un ataque. No acredita éxito en otro sistema.',
    },
    {
      title: 'Compromiso confirmado',
      text: 'Acreditar una acción no autorizada. Atribuirla a una CVE requiere evidencia adicional.',
    },
  ];
  jump(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start',
      });
      el.focus({ preventScroll: true });
    }
  }
}

import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../shared/ui';
import { ProgressService } from '../core/progress';
@Component({ imports: [RouterLink, IconComponent], templateUrl: './home.html' })
export class HomePage {
  readonly p = inject(ProgressService);
  readonly modules = [
    {
      n: '01',
      icon: 'shield',
      title: 'Comprobador de versiones',
      text: 'Compara tu versión con las primeras correcciones oficiales. Entiende qué demuestra el resultado.',
      path: '/versiones',
      cta: 'Comprobar versión',
      class: 'version',
      tag: 'REFERENCIA UPSTREAM',
    },
    {
      n: '02',
      icon: 'check',
      title: 'Checklist de auditoría',
      text: '18 comprobaciones con ayuda, evidencias y progreso. Aplica el método al caso Twinteach.',
      path: '/auditoria',
      cta: 'Auditar paso a paso',
      class: 'audit',
      tag: 'GUÍA DOCUMENTADA',
    },
    {
      n: '03',
      icon: 'clock',
      title: 'Cronología del incidente',
      text: 'De los primeros indicios a los parches. Distingue descubrimiento, divulgación y actividad observada.',
      path: '/cronologia',
      cta: 'Explorar la historia',
      class: 'timeline',
      tag: 'CONTEXTO Y FECHAS',
    },
    {
      n: '04',
      icon: 'search',
      title: 'Laboratorio de indicios',
      text: 'Investiga tres casos ficticios. Relaciona registros y evita conclusiones sin evidencia suficiente.',
      path: '/laboratorio',
      cta: 'Entrar al laboratorio',
      class: 'lab',
      tag: 'ENTORNO SIMULADO',
    },
  ];
}

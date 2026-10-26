import { Routes } from '@angular/router';
export const routes: Routes = [
  {
    path: '',
    title: 'PHP2Shell · Comprende el incidente',
    loadComponent: () => import('./pages/home').then((m) => m.HomePage),
  },
  {
    path: 'incidente',
    title: 'El incidente · PHP2Shell',
    loadComponent: () => import('./pages/knowledge').then((m) => m.IncidentPage),
  },
  {
    path: 'cronologia',
    title: 'Cronología · PHP2Shell',
    loadComponent: () => import('./pages/knowledge').then((m) => m.TimelinePage),
  },
  {
    path: 'vulnerabilidades',
    title: 'Los dos CVE · PHP2Shell',
    loadComponent: () => import('./pages/knowledge').then((m) => m.VulnerabilitiesPage),
  },
  {
    path: 'versiones',
    title: 'Comprobador de versiones · PHP2Shell',
    loadComponent: () => import('./pages/versions').then((m) => m.VersionsPage),
  },
  {
    path: 'guia',
    title: 'Guía de aprendizaje · PHP2Shell',
    loadComponent: () => import('./pages/guide').then((m) => m.GuidePage),
  },
  {
    path: 'auditoria',
    title: 'Checklist de Twinteach · PHP2Shell',
    loadComponent: () => import('./pages/audit').then((m) => m.AuditPage),
  },
  {
    path: 'laboratorio',
    title: 'Laboratorio de indicios · PHP2Shell',
    loadComponent: () => import('./pages/lab').then((m) => m.LabPage),
  },
  {
    path: 'conclusiones',
    title: 'Conclusiones · PHP2Shell',
    loadComponent: () => import('./pages/knowledge').then((m) => m.ConclusionsPage),
  },
  {
    path: 'fuentes',
    title: 'Fuentes · PHP2Shell',
    loadComponent: () => import('./pages/knowledge').then((m) => m.SourcesPage),
  },
  {
    path: 'ayuda',
    title: 'Glosario y ayuda · PHP2Shell',
    loadComponent: () => import('./pages/knowledge').then((m) => m.HelpPage),
  },
  {
    path: '**',
    title: 'Página no encontrada · PHP2Shell',
    loadComponent: () => import('./pages/knowledge').then((m) => m.NotFoundPage),
  },
];

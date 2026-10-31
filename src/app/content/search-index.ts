import { LESSONS } from './learning';
import { GLOSSARY } from './references';

export interface SearchEntry {
  id: string;
  title: string;
  description: string;
  category: string;
  path: string;
  params?: Record<string, string | number>;
  keywords?: string;
}
export const SEARCH_INDEX: SearchEntry[] = [
  {
    id: 'incident',
    title: 'El incidente, explicado desde cero',
    description: 'Qué pasó, conceptos, consecuencias y preguntas frecuentes.',
    category: 'Contexto',
    path: '/incidente',
    keywords: 'php2shell memoria rce oom fallo',
  },
  {
    id: 'versions',
    title: 'Comprobar una versión de PHP',
    description: 'Versiones iniciales corregidas, paquetes y límites de la comparación.',
    category: 'Herramienta',
    path: '/versiones',
    keywords: 'parche actualizar backport seguridad',
  },
  {
    id: 'audit',
    title: 'Auditoría de Twinteach',
    description: 'Cinco etapas para documentar entorno, parches, defensas, indicios e informe.',
    category: 'Práctica',
    path: '/auditoria',
    keywords: 'checklist tareas evidencia laravel angular',
  },
  {
    id: 'guide',
    title: 'Guía paso a paso',
    description: 'Seis capítulos con una idea, tres acciones y un resultado esperado.',
    category: 'Aprendizaje',
    path: '/guia',
    keywords: 'empezar aprender sencillo',
  },
  {
    id: 'lab',
    title: 'Laboratorio de indicios',
    description: 'Practicar la interpretación de registros ficticios.',
    category: 'Práctica',
    path: '/laboratorio',
    keywords: 'logs eventos errores ataque evidencias',
  },
  {
    id: 'plan',
    title: 'Preparar mi siguiente paso',
    description: 'Un plan orientativo según acceso, entorno e información disponible.',
    category: 'Aula',
    path: '/aula',
    params: { tab: 'plan' },
    keywords: 'resolver ayuda no acceso bloqueo',
  },
  {
    id: 'timeline',
    title: 'Cronología del incidente',
    description: 'Distinguir investigación, divulgación y actividad observada.',
    category: 'Contexto',
    path: '/cronologia',
    keywords: 'historia fechas descubrimiento',
  },
  {
    id: 'cves',
    title: 'Los dos CVE de PHP2Shell',
    description: 'Memoria agotada y referencias antiguas; explicación sencilla y técnica.',
    category: 'Contexto',
    path: '/vulnerabilidades',
    keywords: 'CVE-2026-109618 CVE-2026-109619 OOM use-after-free',
  },
  {
    id: 'reports',
    title: 'Guía sencilla e informe detallado',
    description: 'Materiales de lectura y descarga para estudiar.',
    category: 'Materiales',
    path: '/aula',
    params: { tab: 'resources' },
    keywords: 'descargar pdf imprimir markdown informe',
  },
  {
    id: 'sources',
    title: 'Fuentes y créditos',
    description: 'Referencias técnicas, fotografías reales y recursos de Uiverse.',
    category: 'Consulta',
    path: '/fuentes',
    keywords: 'bibliografia licencia css videos imagenes',
  },
  {
    id: 'help',
    title: 'Glosario y preferencias',
    description: 'Términos, estados de auditoría y elección de tema.',
    category: 'Ayuda',
    path: '/ayuda',
    keywords: 'modo oscuro claro automatico tema',
  },
  ...LESSONS.map((lesson, index) => ({
    id: 'lesson-' + lesson.id,
    title: lesson.title,
    description: lesson.goal,
    category: 'Lección ' + (index + 1),
    path: '/aula',
    params: { lesson: index },
    keywords: lesson.short + ' ' + lesson.id + ' ' + lesson.technical.join(' '),
  })),
  ...GLOSSARY.map(([term, definition], index) => ({
    id: 'term-' + index,
    title: term,
    description: definition,
    category: 'Glosario',
    path: '/ayuda',
  })),
];

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}
export function searchContent(query: string): SearchEntry[] {
  const normalized = normalize(query.slice(0, 160));
  if (!normalized) return SEARCH_INDEX.slice(0, 6);
  const words = normalized.split(/\s+/);
  return SEARCH_INDEX.map((entry, order) => {
    const title = normalize(entry.title);
    const haystack = normalize(
      [entry.title, entry.description, entry.category, entry.keywords ?? ''].join(' '),
    );
    return {
      entry,
      order,
      match: words.every((word) => haystack.includes(word)),
      score:
        words.filter((word) => title.includes(word)).length + (title.includes(normalized) ? 3 : 0),
    };
  })
    .filter((item) => item.match)
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .slice(0, 12)
    .map((item) => item.entry);
}

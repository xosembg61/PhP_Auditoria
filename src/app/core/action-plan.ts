import { REFERENCES, REVIEW_DATE } from '../content/references';
export const PLAN_QUESTIONS = [
  {
    key: 'role',
    label: '¿Qué acceso tienes?',
    options: [
      { id: 'learner', label: 'Estoy aprendiendo / no administro el servidor' },
      { id: 'admin', label: 'Administro el entorno con autorización' },
    ],
  },
  {
    key: 'environment',
    label: '¿Cómo se aloja PHP?',
    options: [
      { id: 'unknown', label: 'No lo sé todavía' },
      { id: 'hosting', label: 'Hosting o panel gestionado por un proveedor' },
      { id: 'linux', label: 'Servicio administrado en un sistema Linux' },
      { id: 'container', label: 'Contenedores o varias réplicas' },
    ],
  },
  {
    key: 'patch',
    label: '¿Qué conoces del parche?',
    options: [
      { id: 'unknown', label: 'No conozco versión o paquete' },
      { id: 'old', label: 'Versión upstream anterior, sin backport acreditado' },
      { id: 'upstream', label: 'Número upstream corregido; falta comprobar el servicio' },
      { id: 'vendor', label: 'El proveedor documenta un backport del paquete' },
    ],
  },
  {
    key: 'activity',
    label: '¿Qué se ha observado?',
    options: [
      { id: 'unknown', label: 'No se han revisado registros' },
      { id: 'none', label: 'Sin indicios en los datos revisados' },
      { id: 'anomaly', label: 'Errores o reinicios sospechosos sin causa confirmada' },
      { id: 'unauthorized', label: 'Actividad no autorizada que requiere respuesta' },
    ],
  },
  {
    key: 'coverage',
    label: '¿Qué cobertura tienen los registros?',
    options: [
      { id: 'unknown', label: 'No conozco su cobertura' },
      { id: 'partial', label: 'Hay periodos o fuentes sin información' },
      { id: 'documented', label: 'Fuentes y ventana revisadas están documentadas' },
    ],
  },
] as const;
export type PlanInput = {
  role: string;
  environment: string;
  patch: string;
  activity: string;
  coverage: string;
};
export interface PlanAction {
  id: string;
  priority: string;
  title: string;
  action: string;
  evidence: string;
  avoid: string;
  section: string;
  sources: string[];
}
export function validPlanInput(v: unknown): v is PlanInput {
  if (!v || typeof v !== 'object') return false;
  return PLAN_QUESTIONS.every((q) =>
    q.options.some((o) => o.id === (v as Record<string, unknown>)[q.key]),
  );
}
export function buildActionPlan(input: PlanInput): PlanAction[] {
  if (!validPlanInput(input)) return [];
  const actions: PlanAction[] = [];
  if (input.activity === 'unauthorized')
    actions.push({
      id: 'response',
      priority: 'INMEDIATA',
      title: 'Coordinar respuesta y preservar evidencias',
      action:
        'Involucra al responsable de respuesta a incidentes. Preserva registros y acuerda la contención según su procedimiento antes de cambios que puedan destruir evidencia volátil. El parche no sustituye investigar el posible compromiso.',
      evidence:
        'Registro de escalado, fuentes preservadas, marcas temporales y decisiones autorizadas.',
      avoid:
        'No borrar logs, atribuir una CVE sin análisis ni dar por resuelto un compromiso solo por actualizar.',
      section: 'D',
      sources: ['aws', 'owasp-logs'],
    });
  if (input.role === 'learner' || input.environment === 'hosting')
    actions.push({
      id: 'owner',
      priority: 'PRIMER PASO',
      title: 'Pedir una comprobación concreta al responsable',
      action:
        'Usa la plantilla de solicitud para pedir runtime web, paquete, procedencia, correcciones de los dos CVE, procesos renovados y seguimiento del día 23. Si no administras el entorno, no inventes resultados ni ejecutes cambios.',
      evidence: 'Respuesta del responsable con datos y referencias saneadas.',
      avoid: 'No pedir ni enviar contraseñas, tokens o volcados completos de configuración.',
      section: 'A',
      sources: ['php'],
    });
  actions.push({
    id: 'inventory',
    priority: 'ALTA',
    title:
      input.environment === 'unknown'
        ? 'Identificar el entorno antes de elegir el procedimiento'
        : 'Relacionar cada aplicación con su runtime',
    action:
      input.environment === 'container'
        ? 'Inventaría imágenes, etiquetas o digest, réplicas y workers. Relaciona el servicio con la imagen que realmente ejecuta.'
        : 'Identifica SAPI, versión web y origen del paquete. Separa la consola del proceso HTTP y anota otras aplicaciones PHP.',
    evidence: 'Inventario anonimizado por entorno, servicio y función responsable.',
    avoid:
      'No extrapolar php -v a todos los procesos ni asumir que una réplica representa al resto.',
    section: 'A',
    sources: ['sapi', 'fpm'],
  });
  actions.push({
    id: 'patch',
    priority: input.patch === 'old' ? 'ALTA · PRIORIZAR CAMBIO' : 'ALTA · COMPROBAR',
    title:
      input.patch === 'vendor'
        ? 'Contrastar el backport exacto con el proveedor'
        : 'Acreditar la corrección de ambos CVE',
    action:
      input.patch === 'unknown'
        ? 'Obtén primero la versión completa y procedencia. Después contrasta upstream o avisos del proveedor.'
        : input.patch === 'vendor'
          ? 'Comprueba distribución, release, repositorio y revisión exacta. La referencia del proveedor no demuestra por sí sola que el paquete esté instalado y cargado.'
          : input.patch === 'upstream'
            ? 'El número es una referencia inicial: comprueba el paquete y el runtime efectivo antes de cerrar.'
            : 'Coordina la actualización a un paquete corregido o acredita un backport. Si el cambio no puede ser inmediato, el responsable debe valorar mitigaciones oficiales y sus límites.',
    evidence:
      'Versión y revisión exactas, los dos avisos aplicables y registro de cambio si corresponde.',
    avoid: 'No recortar sufijos de paquete ni usar una regla de WAF como sustituto del parche.',
    section: 'B',
    sources: ['php', 'oom', 'state'],
  });
  actions.push({
    id: 'verify',
    priority: 'TRAS EL CAMBIO',
    title: 'Confirmar código corregido en uso y seguimiento',
    action:
      input.environment === 'container'
        ? 'Revisa reconstrucción y despliegue de la imagen corregida en todas las réplicas. Verifica los procesos efectivos y el aviso de sesiones del 23 de octubre.'
        : 'Comprueba la renovación de los procesos pertinentes, el runtime web posterior al cambio y si aplica el aviso de sesiones del 23 de octubre.',
    evidence:
      'Comprobación fechada del servicio y lista de instancias revisadas, con pendientes visibles.',
    avoid: 'No cerrar con el instalador, con el número CLI o con una sola instancia.',
    section: 'B',
    sources: ['php', 'fpm', 'laravel'],
  });
  actions.push({
    id: 'investigate',
    priority: input.activity === 'anomaly' ? 'ALTA · INVESTIGAR' : 'REVISIÓN HISTÓRICA',
    title:
      input.activity === 'anomaly'
        ? 'Correlacionar las anomalías antes de atribuirlas'
        : 'Revisar actividad con su cobertura real',
    action:
      (input.coverage === 'documented'
        ? 'Mantén explícitos los límites de las fuentes revisadas. '
        : 'Primero documenta fuentes, huecos y retención; la falta de registros no prueba ausencia de ataque. ') +
      (input.activity === 'none'
        ? 'Conserva la conclusión «sin indicios en los datos revisados» sin ampliarla a periodos desconocidos.'
        : 'Relaciona accesos, errores, procesos e integridad; contrasta cambios autorizados y explicaciones alternativas. Atribuir PHP2Shell necesita reconstruir el vector.'),
    evidence:
      'Ventana, zona horaria, fuentes, eventos relevantes y limitaciones. Revisa desde al menos el 17 de octubre cuando exista cobertura, ajustándolo a la exposición real.',
    avoid: 'No tratar un 500 como prueba de RCE ni un silencio de logs como certificado.',
    section: 'D',
    sources: ['aws', 'state', 'laravel-logs'],
  });
  actions.push({
    id: 'document',
    priority: 'CIERRE',
    title: 'Separar la conclusión del parche y la de actividad',
    action:
      'Documenta hechos, dudas y acciones. Asigna una función responsable y un plazo por acordar. Usa la checklist para registrar evidencias; este plan no completa ninguna tarea.',
    evidence: 'Informe con alcance, referencias, pendientes y siguiente acción verificable.',
    avoid:
      'No certificar seguridad mediante porcentajes o presentar ejemplos como resultados reales.',
    section: 'E',
    sources: ['owasp-logs'],
  });
  return actions;
}
export function answerLabel(key: keyof PlanInput, value: string) {
  return (
    PLAN_QUESTIONS.find((q) => q.key === key)?.options.find((o) => o.id === value)?.label ??
    'Sin indicar'
  );
}
export function actionPlanMarkdown(input: PlanInput): string {
  const actions = buildActionPlan(input);
  if (!actions.length) return '';
  return (
    '# PHP2Shell · Plan orientativo\n\nRevisión de contenido: ' +
    REVIEW_DATE +
    '\n\nBasado únicamente en respuestas del visitante. No es un diagnóstico, una auditoría ni una verificación de su sistema.\n\n## Datos indicados\n\n' +
    PLAN_QUESTIONS.map((q) => '- ' + q.label + ' ' + answerLabel(q.key, input[q.key])).join('\n') +
    '\n\n' +
    actions
      .map(
        (a, i) =>
          '## ' +
          (i + 1) +
          '. ' +
          a.title +
          '\n\nPrioridad: ' +
          a.priority +
          '\n\n' +
          a.action +
          '\n\n**Evidencia:** ' +
          a.evidence +
          '\n\n**Evitar:** ' +
          a.avoid +
          '\n\n**Checklist:** sección ' +
          a.section +
          '\n',
      )
      .join('\n') +
    '\n## Fuentes\n\n' +
    REFERENCES.filter((s) => actions.some((a) => a.sources.includes(s.id)))
      .map((s) => '- [' + s.title + '](' + s.url + ')')
      .join('\n') +
    '\n'
  );
}
export function supportRequestMarkdown(): string {
  return '# Solicitud de revisión de PHP2Shell\n\nPlantilla para adaptar y enviar por el canal autorizado. Esta aplicación no envía mensajes. No incluyas credenciales.\n\nSolicito confirmar para cada entorno y servicio PHP:\n\n1. Versión del runtime web, SAPI y procedencia del paquete o imagen.\n2. Revisión exacta instalada y referencias de corrección de CVE-2026-109618 y CVE-2026-109619. Si hay backport, distribución y release a las que aplica.\n3. Renovación de procesos y comprobación posterior del runtime efectivo.\n4. Revisión de aplicabilidad del aviso PHP de sesiones del 23 de octubre de 2026.\n5. Otras instancias, workers o réplicas cubiertas y elementos pendientes.\n6. Fuentes y cobertura temporal de logs; hallazgos, limitaciones y siguiente acción.\n\nDatos no conocidos: dejar pendientes, sin presuponer el estado de Twinteach.\n\nFuente oficial: https://www.php.net/archive/2026.php\n';
}

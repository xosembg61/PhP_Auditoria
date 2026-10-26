export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'ALERT';
export type LogSource = 'WEB' | 'PHP' | 'MON';
export interface LogEvent {
  id: string;
  timestamp: string;
  source: LogSource;
  level: LogLevel;
  ip: string;
  message: string;
  interpretation: string;
  uncertainty: string;
  next: string;
  related: string[];
}
export interface Scenario {
  id: string;
  title: string;
  description: string;
  events: LogEvent[];
  anchors: string[];
  conclusion: string;
  feedback: string;
  hints: string[];
}
function event(
  id: string,
  time: string,
  source: LogSource,
  level: LogLevel,
  message: string,
  interpretation: string,
  uncertainty: string,
  next: string,
  related: string[] = [],
): LogEvent {
  return {
    id,
    timestamp: '2026-10-21T' + time + 'Z',
    source,
    level,
    ip: source === 'WEB' ? '192.0.2.10' : '—',
    message,
    interpretation,
    uncertainty,
    next,
    related,
  };
}
const normal = [
  event(
    'n1',
    '10:30:02',
    'WEB',
    'INFO',
    'GET /inicio → 200',
    'Petición atendida.',
    'El código 200 no prueba legitimidad ni ataque.',
    'Revisa contexto y autenticación si procede.',
  ),
  event(
    'n2',
    '10:30:12',
    'WEB',
    'INFO',
    'GET /estilos.css → 200',
    'Carga de un recurso.',
    'No hay indicio específico de explotación.',
    'Relaciona con la navegación.',
  ),
  event(
    'n3',
    '10:31:14',
    'WEB',
    'WARN',
    'GET /favicon-antiguo.ico → 404',
    'Recurso no encontrado.',
    'Un 404 aislado puede ser normal.',
    'Comprueba enlaces antiguos.',
  ),
  event(
    'n4',
    '10:31:30',
    'WEB',
    'WARN',
    'POST /login → 401 · un intento fallido',
    'Autenticación fallida aislada.',
    'Puede ser una contraseña mal escrita. No demuestra intrusión.',
    'Busca repetición y contexto de cuenta.',
  ),
  event(
    'n5',
    '10:32:10',
    'PHP',
    'WARN',
    'Recurso de imagen no disponible',
    'Error de recurso en el ejemplo.',
    'No demuestra corrupción de memoria ni RCE.',
    'Contrasta la configuración de recursos.',
  ),
];
const suspicious = [
  event(
    's1',
    '10:30:02',
    'WEB',
    'INFO',
    'GET /inicio → 200',
    'Navegación de referencia.',
    'No determina si otros eventos son maliciosos.',
    'Compara tiempos.',
  ),
  event(
    's2',
    '10:30:12',
    'WEB',
    'INFO',
    'GET /estilos.css → 200',
    'Carga de estilo.',
    'Sin indicador específico.',
    'Revisa eventos posteriores.',
  ),
  event(
    's3',
    '10:31:14',
    'WEB',
    'WARN',
    'POST /formulario → 413 · petición atípica',
    'Petición rechazada por tamaño.',
    'No demuestra que PHP la procesara ni que ejecutara código.',
    'Relaciona con el proceso y errores.',
    ['s4', 's5'],
  ),
  event(
    's4',
    '10:31:15',
    'PHP',
    'WARN',
    'Worker reiniciado inesperadamente',
    'Incidencia de proceso cercana a la petición.',
    'Puede tener otras causas; no acredita RCE.',
    'Contrasta motivo de reinicio y cambios.',
    ['s3', 's5'],
  ),
  event(
    's5',
    '10:31:18',
    'MON',
    'ALERT',
    'Correlación temporal de petición y reinicio',
    'Alerta que requiere revisión.',
    'Una alerta no confirma una intrusión.',
    'Preserva registros y busca evidencia independiente.',
    ['s3', 's4'],
  ),
  event(
    's6',
    '10:32:09',
    'WEB',
    'INFO',
    'GET /ayuda → 200',
    'Petición atendida después del incidente.',
    'Una respuesta normal no descarta compromiso previo.',
    'Comprueba cobertura de los registros.',
  ),
];
const convergent = [
  event(
    'c1',
    '10:30:02',
    'WEB',
    'INFO',
    'GET /inicio → 200',
    'Actividad de referencia.',
    'No determina legitimidad global.',
    'Revisa el resto de las fuentes.',
  ),
  event(
    'c2',
    '10:31:14',
    'WEB',
    'WARN',
    'POST /formulario → 500 · entrada atípica',
    'Error próximo a las alertas.',
    'No identifica por sí solo una CVE.',
    'Contrasta eventos de procesos e integridad.',
    ['c3', 'c4', 'c5'],
  ),
  event(
    'c3',
    '10:31:15',
    'PHP',
    'ERROR',
    'Worker finalizado de forma inesperada',
    'Incidencia de proceso.',
    'Un fallo puede deberse a causas no maliciosas.',
    'Investiga la ejecución reportada por monitorización.',
    ['c2', 'c4'],
  ),
  event(
    'c4',
    '10:31:18',
    'MON',
    'ALERT',
    'Ejecución de proceso no autorizada · validación simulada',
    'Evidencia independiente de actividad no autorizada en este caso ficticio.',
    'No acredita la técnica inicial ni atribuye PHP2Shell.',
    'Preserva trazas y delimita alcance.',
    ['c2', 'c3', 'c5'],
  ),
  event(
    'c5',
    '10:31:25',
    'MON',
    'ALERT',
    'Cambio fuera de ventana aprobada · informe de integridad ficticio',
    'Segundo respaldo de posible compromiso.',
    'Hay que validar integridad y cadena de custodia en un caso real. No identifica la CVE.',
    'Correlaciona con procesos y revisa cambios autorizados.',
    ['c2', 'c4'],
  ),
  event(
    'c6',
    '10:32:09',
    'WEB',
    'INFO',
    'GET /ayuda → 200',
    'Actividad posterior.',
    'Continuar sirviendo tráfico no prueba ausencia de intrusión.',
    'Mantén investigación y conservación de evidencia.',
  ),
];
export const SCENARIOS: Scenario[] = [
  {
    id: 'normal',
    title: 'Una alerta que no lo es',
    description:
      'Un recurso no encontrado, un acceso fallido y un error de imagen. Busca qué demuestra realmente el conjunto.',
    events: normal,
    anchors: [],
    conclusion: 'normal',
    feedback:
      'Ningún evento aislado demuestra explotación. Hay explicaciones habituales y faltan evidencias de intrusión.',
    hints: [
      '¿Un código de error describe la causa o solo el resultado?',
      'Una contraseña mal escrita también produce un 401.',
      'Ningún evento muestra ejecución no autorizada.',
    ],
  },
  {
    id: 'suspicious',
    title: 'Comportamiento que merece revisión',
    description:
      'Una petición atípica, un reinicio inesperado y una alerta cercana. Correlaciona las tres fuentes.',
    events: suspicious,
    anchors: ['s3', 's4', 's5'],
    conclusion: 'suspicious',
    feedback:
      'La correlación temporal merece investigación. No demuestra ejecución remota de código ni permite atribuir el incidente a PHP2Shell.',
    hints: [
      'Busca más de un registro fuera de lo habitual.',
      'Compara 10:31:14, 10:31:15 y 10:31:18.',
      'Un reinicio tiene varias causas posibles. Falta evidencia independiente de ejecución.',
    ],
  },
  {
    id: 'convergent',
    title: 'Evidencias convergentes',
    description:
      'Petición atípica, alerta de ejecución no autorizada y cambio fuera de ventana respaldado por integridad. Distingue compromiso de atribución.',
    events: convergent,
    anchors: ['c4', 'c5'],
    conclusion: 'possible',
    feedback:
      'Las señales independientes justifican escalar por posible compromiso en el escenario. Falta reconstruir el vector para atribuirlo específicamente a PHP2Shell.',
    hints: [
      'Compara el valor de un error HTTP con el de una ejecución no autorizada.',
      'Busca dos fuentes que respalden actividad no autorizada.',
      'Intrusión y atribución a una CVE son conclusiones diferentes.',
    ],
  },
];
export const CONCLUSIONS = [
  { id: 'normal', label: 'Comportamiento compatible con actividad habitual' },
  { id: 'suspicious', label: 'Actividad sospechosa que requiere investigación' },
  { id: 'insufficient', label: 'Información insuficiente para una conclusión' },
  { id: 'possible', label: 'Posible compromiso: escalar y preservar evidencias' },
  { id: 'attributed', label: 'Ataque PHP2Shell confirmado sin más comprobaciones' },
];
export interface LabAnswer {
  selected: string[];
  conclusion: string;
  justification: string;
  hint: number;
}
export function evaluateScenario(
  s: Scenario,
  a: LabAnswer,
): { accepted: boolean; title: string; text: string } {
  if (a.justification.trim().length < 40)
    return {
      accepted: false,
      title: 'Falta explicar el razonamiento',
      text: 'Escribe al menos 40 caracteres: relaciona los hechos y expresa qué no puedes concluir.',
    };
  if (!a.conclusion)
    return {
      accepted: false,
      title: 'Elige una conclusión',
      text: 'Distingue la observación de la hipótesis.',
    };
  if (a.conclusion === 'attributed')
    return {
      accepted: false,
      title: 'Conclusión precipitada',
      text: 'Ninguno de los casos atribuye una CVE por sí solo. Hace falta reconstruir el vector y contrastar otras evidencias.',
    };
  const missing = s.anchors.filter((id) => !a.selected.includes(id));
  if (missing.length)
    return {
      accepted: false,
      title: 'Falta contexto en la selección',
      text:
        'Relaciona las fuentes relevantes. Faltan ' +
        missing.length +
        ' eventos clave; inspecciona las marcas temporales y las evidencias independientes.',
    };
  if (a.conclusion !== s.conclusion && !(s.id === 'normal' && a.conclusion === 'insufficient'))
    return { accepted: false, title: 'Revisa el alcance de la conclusión', text: s.feedback };
  return {
    accepted: true,
    title: 'Interpretación sólida del caso',
    text:
      s.feedback +
      ' La evaluación orienta selección y conclusión; no valida automáticamente el texto libre.',
  };
}

export const INCIDENT_FLOWS = [
  {
    id: 'normal',
    label: 'Petición normal',
    title: 'Preparar, utilizar y liberar los datos',
    description:
      'Esquema simplificado: PHP debe mantener coherentes sus datos internos durante toda la petición.',
    steps: [
      {
        title: 'Llega la solicitud',
        text: 'El navegador pide una página o envía un formulario.',
      },
      {
        title: 'Se prepara la memoria',
        text: 'PHP organiza los datos que necesita para trabajar.',
      },
      {
        title: 'Se atiende la petición',
        text: 'El motor y la aplicación usan datos válidos.',
      },
      {
        title: 'Se limpia el estado',
        text: 'La memoria se libera sin dejar referencias inválidas.',
      },
    ],
    lesson: 'Que la página se muestre no verifica cómo se gestionó internamente la memoria.',
    sources: ['php'],
  },
  {
    id: 'oom',
    label: 'Fallo 1 · memoria agotada',
    title: 'Una interrupción deja datos a medio preparar',
    description:
      'CVE-2026-109618: ciertas interrupciones por agotamiento de memoria podían dejar estructuras internas inconsistentes.',
    steps: [
      {
        title: 'Ruta vulnerable alcanzable',
        text: 'La exposición depende del runtime, la integración y el entorno.',
      },
      {
        title: 'Se agota la memoria',
        text: 'Una operación interna se interrumpe en un momento problemático.',
      },
      {
        title: 'Queda trabajo incompleto',
        text: 'Algunas estructuras no están listas para ser usadas normalmente.',
      },
      {
        title: 'La limpieza confía en ellas',
        text: 'Procesar ese estado inválido puede causar corrupción de memoria.',
      },
    ],
    lesson:
      'Un error OOM aislado no prueba un ataque. El problema es una ruta concreta de gestión interna que puede tener impacto de seguridad.',
    sources: ['oom'],
  },
  {
    id: 'stale',
    label: 'Fallo 2 · referencia antigua',
    title: 'El proceso conserva una referencia inválida',
    description:
      'CVE-2026-109619: una petición posterior podía acceder a estado de una petición anterior cuya memoria ya se había liberado.',
    steps: [
      {
        title: 'El worker atiende A',
        text: 'Se crean datos asociados a la primera petición.',
      },
      {
        title: 'Se libera su memoria',
        text: 'Pero una referencia al estado anterior no se limpia correctamente.',
      },
      {
        title: 'El mismo worker atiende B',
        text: 'Un proceso persistente puede recibir otra petición.',
      },
      {
        title: 'Se utiliza el estado antiguo',
        text: 'Acceder a memoria ya liberada es un use-after-free.',
      },
    ],
    lesson:
      'Worker significa proceso de trabajo. El fallo no implica que todas las peticiones compartan sus datos por diseño.',
    sources: ['state'],
  },
];
export const INCIDENT_TERMS = [
  {
    term: 'PHP',
    meaning: 'El programa que interpreta y ejecuta código PHP en el servidor.',
  },
  {
    term: 'Petición',
    meaning: 'Mensaje del navegador al servidor: abrir una página o enviar un formulario.',
  },
  {
    term: 'Memoria',
    meaning: 'Espacio de trabajo temporal donde el programa mantiene sus datos.',
  },
  {
    term: 'RCE',
    meaning:
      'Ejecución remota de código con los permisos del proceso, si se cumplen las condiciones del fallo.',
  },
];
export const INCIDENT_FAQ = [
  {
    q: '¿Es un virus?',
    a: 'PHP2Shell es el nombre usado para dos fallos del intérprete, no un virus. Tener una versión afectada tampoco demuestra que alguien haya aprovechado el fallo.',
    sources: ['php'],
  },
  {
    q: '¿Hay riesgo aunque la página funcione?',
    a: 'Que una página responda no acredita el paquete instalado, la corrección del motor ni la ausencia de una intrusión anterior.',
    sources: ['php', 'state'],
  },
  {
    q: '¿Un inicio de sesión evita el problema?',
    a: 'No debe usarse como garantía: PHP documenta rutas sin autenticación, algunas anteriores al código de la aplicación. Hay que corregir el runtime.',
    sources: ['php', 'oom'],
  },
  {
    q: '¿9,2 significa un 92 % de probabilidad de ataque?',
    a: 'No. CVSS mide gravedad técnica. No representa la probabilidad de intrusión de tu servidor ni el porcentaje de sitios comprometidos.',
    sources: ['oom', 'state'],
  },
  {
    q: '¿Actualizar Laravel o WordPress basta?',
    a: 'Además hay que verificar el PHP que ejecuta la aplicación. La aplicación y su intérprete son piezas distintas.',
    sources: ['php'],
  },
  {
    q: '¿Reiniciar lo arregla?',
    a: 'Reiniciar sin corregir no añade el parche. Después de actualizar, renueva los procesos pertinentes y comprueba el runtime efectivo según el procedimiento del proveedor.',
    sources: ['php', 'fpm'],
  },
  {
    q: '¿Cómo averiguo si hubo un ataque?',
    a: 'Correlaciona accesos, errores, procesos e integridad de archivos; documenta cobertura y alternativas. Ante actividad no autorizada, preserva evidencia y coordina la respuesta.',
    sources: ['aws', 'state'],
  },
  {
    q: '¿Y si el número de versión es antiguo?',
    a: 'Puede existir un backport. Acredítalo con distribución, revisión exacta y aviso del proveedor; después verifica que el servicio utiliza ese paquete.',
    sources: ['php', 'ubuntu-oom', 'ubuntu-state'],
  },
];

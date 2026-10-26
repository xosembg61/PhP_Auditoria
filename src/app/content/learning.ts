export interface LessonStep {
  title: string;
  action: string;
  lookFor: string;
  record: string;
}
export interface Lesson {
  id: string;
  title: string;
  goal: string;
  short: string;
  analogy: string;
  limit: string;
  technical: string[];
  steps: LessonStep[];
  example: { label: string; command: string; output: string; means: string; doesNot: string };
  mistakes: { claim: string; correction: string }[];
  question: {
    text: string;
    options: { id: string; text: string; feedback: string }[];
    correct: string;
  };
  sources: string[];
  section: string;
}
export interface EvidenceDrill {
  id: string;
  title: string;
  evidence: string;
  question: string;
  answer: string;
  feedback: string;
  next: string;
  section: string;
}

export const LESSONS: Lesson[] = [
  {
    id: 'runtime',
    title: 'Dónde está realmente el fallo',
    goal: 'Separar frontend, aplicación e intérprete antes de decidir qué actualizar.',
    short:
      'PHP ejecuta el backend. Si falla el intérprete, actualizar solo Angular o Laravel deja esa pieza sin comprobar.',
    analogy:
      'Piensa en una receta y en la cocina donde se prepara. Cambiar la receta no repara automáticamente un equipo defectuoso de la cocina.',
    limit:
      'Es una comparación didáctica: una vulnerabilidad de memoria depende de rutas técnicas concretas, no de que toda petición falle.',
    technical: [
      'Angular se ejecuta habitualmente en el navegador; Laravel depende de PHP en el backend. Hay otras aplicaciones PHP que también deben inventariarse.',
      'El impacto de un fallo del intérprete depende de la versión, el paquete y las condiciones alcanzables. Usar PHP no demuestra compromiso.',
    ],
    steps: [
      {
        title: 'Dibuja el recorrido de una petición',
        action:
          'Navegador → Angular → API HTTP → Laravel/PHP → servicios internos. Añade otras aplicaciones PHP conocidas.',
        lookFor: 'Un mapa que diferencie código de aplicación y runtime.',
        record: 'Arquitectura conceptual; marca como desconocido lo que no esté verificado.',
      },
      {
        title: 'Localiza la pieza que corrige el fallo',
        action: 'Consulta quién mantiene PHP y cómo se instala en ese entorno.',
        lookFor:
          'Un paquete del sistema, una imagen, una instalación del proveedor o una compilación propia.',
        record: 'Origen del runtime y función responsable.',
      },
      {
        title: 'Evita un cierre prematuro',
        action:
          'Pregunta por separado si se actualizó el framework y si se corrigió el intérprete.',
        lookFor: 'Dos actuaciones distintas, con registros distintos.',
        record: 'Lo que se conoce, lo que se supone y lo que falta comprobar.',
      },
    ],
    example: {
      label: 'Mapa conceptual, no inventario de Twinteach',
      command: '',
      output:
        'Frontend: Angular\nBackend: Laravel sobre PHP\nRuntime web: pendiente de identificar\nEstado de parche: no verificado',
      means: 'La arquitectura orienta dónde buscar; todavía no acredita una versión ni un parche.',
      doesNot: 'No demuestra vulnerabilidad explotable ni intrusión.',
    },
    mistakes: [
      {
        claim: 'El frontend está actualizado, así que PHP2Shell está resuelto.',
        correction: 'Falta verificar PHP en el backend y el resto de servicios que lo ejecutan.',
      },
      {
        claim: 'Todas las webs PHP han sido atacadas con éxito.',
        correction:
          'Exposición, posibilidad técnica, intento observado y compromiso son hechos distintos.',
      },
    ],
    question: {
      text: '¿Qué dato aborda directamente el fallo del intérprete?',
      options: [
        {
          id: 'framework',
          text: 'La versión de Angular',
          feedback: 'Describe el frontend; no identifica el PHP que ejecuta el backend.',
        },
        {
          id: 'runtime',
          text: 'El paquete PHP efectivo del servicio web',
          feedback: 'Ese paquete es la pieza que debes contrastar con el parche y el proveedor.',
        },
        {
          id: 'design',
          text: 'Que la web abra correctamente',
          feedback: 'Servir la página no demuestra la corrección del runtime.',
        },
      ],
      correct: 'runtime',
    },
    sources: ['php', 'sapi'],
    section: 'A',
  },
  {
    id: 'inventory',
    title: 'Encontrar el PHP que sirve la web',
    goal: 'No confundir una salida de consola con una comprobación del servicio HTTP.',
    short:
      'Puede haber varios PHP en el mismo servidor. La consola, PHP-FPM, Apache y un contenedor no tienen por qué compartir versión o configuración.',
    analogy:
      'La etiqueta de un ordenador del aula no identifica todos los ordenadores del edificio. Primero relaciona cada servicio con su equipo.',
    limit:
      'Un proceso puede estar dentro de un contenedor o gestionado por un proveedor: el inventario debe reflejar esa arquitectura real.',
    technical: [
      'SAPI es la interfaz de integración de PHP. CLI se usa desde consola; FPM gestiona procesos que reciben trabajo del servidor web.',
      'Los pools FPM pueden tener configuraciones distintas. Un comando de consola muestra su propia configuración, no la de todos los servicios.',
    ],
    steps: [
      {
        title: 'Relaciona la aplicación con su servicio',
        action:
          'Consulta el panel, el inventario o el despliegue autorizado. Identifica pool, módulo, contenedor o servicio gestionado.',
        lookFor: 'La relación concreta entre la aplicación y su runtime web.',
        record: 'Entorno, SAPI, proveedor y fecha.',
      },
      {
        title: 'Usa la consola como dato auxiliar',
        action:
          'Si tienes acceso autorizado, consulta php -v y php --ini. Esta web solo los muestra: no ejecuta comandos.',
        lookFor: 'Versión CLI y archivos de configuración de CLI.',
        record: 'Etiqueta expresamente el resultado como CLI.',
      },
      {
        title: 'Pide la comprobación del runtime web',
        action:
          'Contrasta el paquete y la configuración del proceso que atiende HTTP con el administrador.',
        lookFor:
          'Una evidencia específica del servicio, no una suposición por coincidencia de nombres.',
        record: 'Paquete efectivo, versión, SAPI y referencia administrativa.',
      },
    ],
    example: {
      label: 'Salida sintética de consola',
      command: 'php -v\nphp --ini',
      output:
        'PHP 8.3.36 (cli) [SALIDA FICTICIA]\nLoaded Configuration File: /ruta-de-ejemplo/php.ini',
      means: 'La consola del ejemplo utiliza esa versión y ese archivo.',
      doesNot:
        'No prueba que PHP-FPM, Apache o las réplicas usen esa misma versión. No publiques un phpinfo() accesible por Internet.',
    },
    mistakes: [
      {
        claim: 'php -v muestra una versión corregida: todo el servidor está actualizado.',
        correction: 'Comprueba el runtime HTTP, workers y otras instancias por separado.',
      },
      {
        claim: 'FPM utiliza siempre la misma configuración que CLI.',
        correction: 'Identifica su pool y configuración efectiva.',
      },
    ],
    question: {
      text: 'Solo conoces el PHP de consola. ¿Cómo queda la tarea del runtime web?',
      options: [
        {
          id: 'done',
          text: 'Comprobada automáticamente',
          feedback: 'La evidencia disponible solo cubre CLI.',
        },
        {
          id: 'pending',
          text: 'En revisión o bloqueada, con el dato que falta',
          feedback: 'Documenta la versión CLI como auxiliar y pide verificar el servicio web.',
        },
        {
          id: 'attack',
          text: 'Ataque confirmado',
          feedback: 'La falta de un inventario no acredita un ataque.',
        },
      ],
      correct: 'pending',
    },
    sources: ['sapi', 'fpm', 'cli-options'],
    section: 'A',
  },
  {
    id: 'backport',
    title: 'Leer versiones sin caer en falsos positivos',
    goal: 'Distinguir un mínimo upstream de una revisión de paquete del proveedor.',
    short:
      'El número base de PHP no cuenta toda la historia. Una distribución puede incorporar el parche sin cambiar a la primera versión corregida publicada por PHP.',
    analogy:
      'Un libro puede conservar el número de edición y llevar una fe de erratas incorporada. Necesitas identificar la revisión exacta y quién la publicó.',
    limit:
      'No basta con afirmar que puede haber un backport: hay que acreditar que el paquete instalado lo contiene y que el servicio lo está usando.',
    technical: [
      'Upstream identifica publicaciones del proyecto PHP. Los paquetes de distribución añaden revisiones y pueden retroportar correcciones.',
      'Para paquetes del proveedor, compara distribución, release, repositorio, nombre y revisión exacta. Los estados del proveedor no se trasladan a un PPA o una imagen ajena.',
    ],
    steps: [
      {
        title: 'Identifica el tipo de versión',
        action:
          'Distingue una versión upstream como 8.3.36 de una cadena de paquete que incluye una revisión del proveedor.',
        lookFor: 'La cadena completa, sin recortar sufijos para obtener un resultado favorable.',
        record: 'Versión completa y procedencia.',
      },
      {
        title: 'Consulta los dos CVE',
        action: 'Busca la distribución y el paquete exactos en los avisos oficiales del proveedor.',
        lookFor: 'Una corrección documentada para ambos CVE iniciales.',
        record: 'Enlaces, release y revisión corregida consultada.',
      },
      {
        title: 'Cierra el salto entre documento y servidor',
        action:
          'Confirma que esa revisión está instalada y cargada por el servicio web. Revisa por separado el seguimiento del 23 de octubre.',
        lookFor: 'Comprobación posterior del runtime efectivo.',
        record: 'Fecha, servicio y evidencia de uso del paquete.',
      },
    ],
    example: {
      label: 'Referencia oficial de Ubuntu consultada el 26/10/2026',
      command: '',
      output:
        'Distribución: Ubuntu 22.04 LTS (jammy)\nPaquete fuente: php8.1\nRevisión indicada como corregida para los dos CVE iniciales:\n8.1.2-1ubuntu2.28',
      means:
        'Las fichas oficiales de Ubuntu registran una corrección del proveedor con número base 8.1.2.',
      doesNot:
        'No clasifica cualquier 8.1.2 como corregido, no acredita el estado de Twinteach y no resuelve por sí solo el seguimiento de sesiones del día 23.',
    },
    mistakes: [
      {
        claim: 'Toda versión 8.1.2 carece necesariamente de parche.',
        correction:
          'El soporte upstream y la revisión corregida de un proveedor son preguntas diferentes.',
      },
      {
        claim: 'Puede haber un backport, así que lo doy por aplicado.',
        correction: 'Sin revisión exacta y aviso correspondiente, el estado sigue sin comprobar.',
      },
    ],
    question: {
      text: '¿Qué respalda mejor un backport?',
      options: [
        {
          id: 'number',
          text: 'El número base de PHP, sin sufijos',
          feedback: 'El número base omite la revisión que identifica el parche del proveedor.',
        },
        {
          id: 'rumor',
          text: 'Un comentario que dice que el hosting actualiza solo',
          feedback: 'Pide confirmación específica del paquete y del servicio.',
        },
        {
          id: 'vendor',
          text: 'Paquete exacto, release y aviso del proveedor',
          feedback: 'Después contrasta que el servicio utiliza efectivamente ese paquete.',
        },
      ],
      correct: 'vendor',
    },
    sources: ['php', 'ubuntu-oom', 'ubuntu-state'],
    section: 'B',
  },
  {
    id: 'remediation',
    title: 'Aplicar una corrección y comprobarla',
    goal: 'Entender qué debe cambiar y qué evidencia permite cerrar la actualización.',
    short:
      'Instalar el paquete es una parte del trabajo. También hay que renovar los procesos pertinentes, revisar otras instancias y verificar el servicio después del cambio.',
    analogy:
      'Cambiar una pieza en el almacén no demuestra que todos los equipos estén utilizando la pieza nueva.',
    limit:
      'El procedimiento concreto depende de distribución, alojamiento, contenedores y continuidad del servicio. No hay un comando universal válido para todos.',
    technical: [
      'La remediación debe seguir el procedimiento del proveedor y un cambio autorizado. Los procesos de larga duración requieren atención específica.',
      'El seguimiento del 23 de octubre de PHP trata un vector poco habitual ligado al progreso de subidas y cambios del serializador de sesión durante la ejecución. Consulta sus condiciones antes de cerrar la revisión.',
    ],
    steps: [
      {
        title: 'Preparar el cambio con el responsable',
        action:
          'Identifica versiones, origen del paquete, compatibilidad, respaldo y procedimiento de recuperación.',
        lookFor: 'Un plan de cambio aprobado para ese entorno.',
        record: 'Alcance y función responsable, sin inventar personas.',
      },
      {
        title: 'Actualizar todos los elementos del inventario',
        action:
          'El administrador aplica la corrección del proveedor. En contenedores, revisa imagen base, reconstrucción y despliegue de todas las réplicas.',
        lookFor: 'Paquete o imagen corregidos con referencia trazable.',
        record: 'Registro del cambio y lista de instancias cubiertas.',
      },
      {
        title: 'Validar la carga del código corregido',
        action:
          'Comprueba que los workers o servicios pertinentes se renovaron y que el runtime efectivo corresponde al paquete esperado.',
        lookFor: 'Evidencia posterior al cambio y revisión de errores funcionales.',
        record: 'Hora, comprobación y entornos que sigan pendientes.',
      },
      {
        title: 'Revisar el seguimiento oficial',
        action:
          'Consulta el aviso del día 23 y confirma con el responsable si la configuración y el código afectados existen en el entorno.',
        lookFor:
          'Una respuesta documentada, no una conclusión basada solo en el número de versión.',
        record: 'Condiciones revisadas y medida correspondiente.',
      },
    ],
    example: {
      label: 'Registro de cambio ficticio',
      command: '',
      output:
        'DEMO · Cambio CHG-EJEMPLO\nPaquete corregido: referencia pendiente de adjuntar\nWorkers renovados: documentado en registro del servicio\nRuntime HTTP posterior: pendiente de comprobar\nResultado: actualización todavía en revisión',
      means:
        'La instalación y la renovación están registradas, pero queda una comprobación relevante.',
      doesNot:
        'No corresponde a Twinteach y no debe marcarse como cierre completo hasta aportar la evidencia restante.',
    },
    mistakes: [
      {
        claim: 'Un WAF equivale al parche.',
        correction:
          'Puede reducir exposición a determinadas peticiones; no cambia el intérprete instalado.',
      },
      {
        claim: 'Un cambio genérico de memory_limit sirve para cualquier instalación.',
        correction:
          'Las mitigaciones tienen límites y efectos de disponibilidad; sigue la guía oficial del entorno.',
      },
    ],
    question: {
      text: 'El paquete se instaló, pero los procesos no se han comprobado. ¿Qué sigue?',
      options: [
        {
          id: 'workers',
          text: 'Verificar renovación y runtime efectivo',
          feedback: 'El cierre necesita evidencia del código realmente en uso.',
        },
        {
          id: 'close',
          text: 'Cerrar la revisión solo con el instalador',
          feedback: 'Todavía no sabes qué runtime atiende el servicio.',
        },
        {
          id: 'frontend',
          text: 'Cambiar los estilos de Angular',
          feedback: 'Eso no comprueba la aplicación del parche del intérprete.',
        },
      ],
      correct: 'workers',
    },
    sources: ['php', 'fpm', 'laravel'],
    section: 'B',
  },
  {
    id: 'evidence',
    title: 'Relacionar logs sin inventar una intrusión',
    goal: 'Separar una anomalía, un indicio de compromiso y la atribución a una CVE.',
    short:
      'Un error no explica por sí solo su causa. Combina fuentes, comprueba cobertura temporal y conserva alternativas antes de concluir.',
    analogy:
      'Una alarma y una puerta abierta justifican revisar; no identifican por sí solas quién entró ni cómo lo hizo.',
    limit:
      'En informática necesitas registros íntegros, tiempos comparables y evidencia independiente. Una analogía no sustituye un análisis forense.',
    technical: [
      'La web, el runtime, la aplicación y la monitorización pueden registrar partes distintas de una misma actividad. Los logs de Laravel dependen de sus canales configurados.',
      'Incluye zona horaria, origen e identificadores de correlación cuando existan. Preserva originales bajo el procedimiento de respuesta y usa copias saneadas para compartir.',
    ],
    steps: [
      {
        title: 'Comprobar qué cubren los registros',
        action:
          'Lista accesos, errores del servidor/PHP, aplicación y monitorización; identifica intervalos ausentes.',
        lookFor: 'Cobertura real, retención y zona horaria por fuente.',
        record: 'Qué puedes investigar y qué no.',
      },
      {
        title: 'Relacionar eventos y alternativas',
        action:
          'Ordena peticiones, errores y reinicios. Contrasta tareas programadas, cambios autorizados y fallos operativos.',
        lookFor: 'Coincidencia temporal y respaldos independientes.',
        record: 'Hechos observados y explicaciones alternativas.',
      },
      {
        title: 'Escalar sin atribuir antes de tiempo',
        action:
          'Si aparecen procesos no autorizados o cambios inesperados, involucra al equipo responsable y preserva evidencia.',
        lookFor: 'Un alcance y una causa por confirmar.',
        record: 'Grado de certeza, límites y siguiente acción.',
      },
    ],
    example: {
      label: 'Fragmento sintético de entrenamiento',
      command: '',
      output:
        '10:31:14 UTC · WEB · petición atípica\n10:31:15 UTC · PHP · worker reiniciado\n10:31:18 UTC · MON · alerta de correlación',
      means: 'Hay una relación temporal que merece investigación.',
      doesNot:
        'No demuestra RCE ni identifica PHP2Shell. La ausencia de más eventos tampoco descarta intrusión si la cobertura es parcial.',
    },
    mistakes: [
      {
        claim: 'No hay eventos en laravel.log: no hubo ataque.',
        correction:
          'Puede haber otros canales, huecos de cobertura o errores previos a la aplicación.',
      },
      {
        claim: 'Un HTTP 500 confirma la CVE utilizada.',
        correction: 'El código HTTP no identifica la causa ni la técnica de entrada.',
      },
    ],
    question: {
      text: '¿Qué refuerza más una hipótesis de compromiso?',
      options: [
        {
          id: 'error',
          text: 'Un único HTTP 404',
          feedback: 'Puede ser un recurso ausente o un enlace antiguo.',
        },
        {
          id: 'independent',
          text: 'Ejecución no autorizada respaldada por integridad y contexto',
          feedback:
            'Justifica escalar la investigación; la CVE concreta todavía necesita atribución.',
        },
        {
          id: 'silence',
          text: 'Un intervalo sin logs',
          feedback: 'Eso limita la revisión, no demuestra actividad ni ausencia de ella.',
        },
      ],
      correct: 'independent',
    },
    sources: ['state', 'aws', 'laravel-logs', 'owasp-logs'],
    section: 'D',
  },
  {
    id: 'report',
    title: 'Convertir los datos en un informe útil',
    goal: 'Entregar una conclusión que permita decidir y que otra persona pueda contrastar.',
    short:
      'Un informe separa alcance, hechos, incertidumbres y acciones. La seguridad no se resume con el porcentaje de casillas.',
    analogy:
      'Un parte de revisión dice qué se miró, con qué resultado y qué falta; una pegatina verde sin respaldo no permite reconstruir el trabajo.',
    limit:
      'Un informe describe la evidencia disponible en un momento concreto. No garantiza el estado futuro del sistema.',
    technical: [
      'Relaciona cada afirmación con una evidencia fechada y un activo del inventario. Registra dependencias: paquete, runtime efectivo y estado de los procesos.',
      'Las conclusiones de parche y de investigación son independientes: un servicio puede estar corregido hoy y conservar indicios de una intrusión anterior.',
    ],
    steps: [
      {
        title: 'Definir el alcance',
        action: 'Indica entornos, servicios, fechas, fuentes y limitaciones de acceso.',
        lookFor: 'Una revisión acotada que no afirme cubrir lo que quedó fuera.',
        record: 'Responsable por función y fecha de revisión.',
      },
      {
        title: 'Redactar dos conclusiones separadas',
        action: 'Explica el estado del parche y, por separado, los hallazgos de actividad.',
        lookFor: 'Evidencias que respalden cada conclusión y límites explícitos.',
        record: 'Pendiente, comprobado o investigando, con el motivo.',
      },
      {
        title: 'Priorizar acciones',
        action:
          'Propón siguiente acción, función responsable y plazo por acordar, atendiendo al riesgo real.',
        lookFor: 'Trabajo concreto que reduzca la incertidumbre o la exposición.',
        record: 'Qué hará falta para dar la acción por cerrada.',
      },
    ],
    example: {
      label: 'Conclusión ficticia, limitada y revisable',
      command: '',
      output:
        'DEMO · Solo se ha revisado el runtime de pruebas.\nParche: paquete documentado; producción pendiente de verificar.\nActividad: sin indicios en las fuentes revisadas, con un hueco temporal.\nSiguiente acción: solicitar inventario y cobertura de producción.',
      means: 'La conclusión explica su alcance y evita generalizar a todo el sistema.',
      doesNot: 'No certifica Twinteach ni descarta un ataque en periodos o entornos no revisados.',
    },
    mistakes: [
      {
        claim: '18 casillas marcadas equivalen a 100 % de seguridad.',
        correction:
          'Miden documentación de tareas; las conclusiones dependen de su evidencia y alcance.',
      },
      {
        claim: 'Parcheado hoy significa que nunca hubo compromiso.',
        correction: 'Remediación e investigación histórica son preguntas distintas.',
      },
    ],
    question: {
      text: '¿Qué cierre es más preciso con registros parciales?',
      options: [
        {
          id: 'never',
          text: 'Nunca ha habido intrusión',
          feedback: 'La revisión parcial no permite esa afirmación universal.',
        },
        {
          id: 'always',
          text: 'Todo PHP está comprometido',
          feedback: 'No existe esa evidencia en el caso.',
        },
        {
          id: 'bounded',
          text: 'Sin indicios en los datos revisados, con límites de cobertura',
          feedback: 'Describe lo que se sabe y conserva visible la incertidumbre.',
        },
      ],
      correct: 'bounded',
    },
    sources: ['php', 'state', 'owasp-logs'],
    section: 'E',
  },
];
export const EVIDENCE_DRILLS: EvidenceDrill[] = [
  {
    id: 'cli-only',
    title: 'Una captura de consola',
    evidence:
      'Una persona aporta «PHP 8.3.36 (cli)» y afirma que toda la aplicación web está corregida.',
    question: '¿Es suficiente para cerrar la comprobación del runtime web?',
    answer: 'insufficient',
    feedback:
      'Acredita un dato de CLI, no el proceso que atiende HTTP. Pide SAPI, paquete del servicio web y comprobación posterior.',
    next: 'A2 · Runtime web',
    section: 'A',
  },
  {
    id: 'vendor-proof',
    title: 'Una referencia de backport',
    evidence:
      'En un ejercicio ficticio se aporta la revisión exacta de paquete, su release y los dos avisos oficiales del proveedor. Falta saber si el servicio usa ya ese paquete.',
    question: '¿Puede cerrarse toda la actualización con estos documentos?',
    answer: 'insufficient',
    feedback:
      'La referencia del proveedor respalda el contenido del paquete; todavía falta demostrar instalación y uso efectivo en el servicio.',
    next: 'B3 · Procesos y verificación posterior',
    section: 'B',
  },
  {
    id: 'bounded-conclusion',
    title: 'Una conclusión con límites',
    evidence:
      'El informe de ejemplo identifica registros y ventana revisados, reconoce un día sin cobertura y concluye «sin indicios en los datos analizados».',
    question: '¿Es razonable como conclusión limitada a esas fuentes?',
    answer: 'sufficient',
    feedback:
      'Sí, porque declara el alcance y el hueco. No sería válido convertirla en «no hubo intrusión».',
    next: 'D4 · Clasificación de resultados',
    section: 'D',
  },
  {
    id: 'waf',
    title: 'El panel del WAF está verde',
    evidence:
      'La única evidencia es una captura del WAF sin alertas. No se conoce el paquete PHP ni la cobertura de los logs.',
    question: '¿Eso acredita que el intérprete tiene el parche?',
    answer: 'insufficient',
    feedback:
      'El panel no identifica qué código PHP está en uso. Consulta el runtime y al proveedor; la ausencia de alertas tiene límites.',
    next: 'B1 · Parche o backport',
    section: 'B',
  },
];

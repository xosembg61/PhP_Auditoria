export interface Walkthrough {
  question: string;
  idea: string;
  steps: string[];
  example: string;
  limit: string;
  next: string;
}

/* Pedagogical summaries of the existing referenced tasks; examples are fictional. */
export const AUDIT_WALKTHROUGHS: Record<string, Walkthrough> = {
  A: {
    question: '¿Qué piezas usan PHP y quién puede comprobarlas?',
    idea: 'Antes de decidir qué actualizar, necesitamos un mapa. El PHP de la web, el de consola y el de una tarea programada pueden ser instalaciones distintas.',
    steps: [
      'Enumera aplicaciones y procesos PHP del alcance autorizado.',
      'Relaciona cada servicio con su versión, paquete, forma de ejecución y responsable.',
      'Marca como pendiente cualquier dato que no puedas contrastar.',
    ],
    example:
      'DEMO FICTICIA · API Laravel → servicio PHP-FPM. El responsable confirma el servicio, pero todavía falta la revisión exacta del paquete. Estado: En revisión.',
    limit:
      'Un resultado de php -v informa de la consola. Por sí solo no identifica el PHP que atiende las peticiones web.',
    next: 'Deja una lista con lo conocido y lo pendiente. Si no tienes acceso, solicita al responsable el paquete efectivo del servicio y documenta ese bloqueo.',
  },
  B: {
    question: '¿El PHP que está funcionando contiene la corrección?',
    idea: 'Hay que unir dos evidencias: la documentación del parche y el paquete que usa realmente el servicio. Instalar archivos nuevos también exige comprobar qué procesos siguen en ejecución.',
    steps: [
      'Obtén la versión completa, el proveedor y la revisión del paquete web.',
      'Contrasta los dos avisos iniciales, posibles backports y el seguimiento oficial del 23 de octubre.',
      'Coordina la actualización con el responsable y registra la verificación posterior de servicios y procesos.',
    ],
    example:
      'DEMO FICTICIA · El inventario identifica el paquete y el aviso del proveedor acredita la corrección. Falta confirmar qué ejecuta el proceso web tras el cambio: esa verificación sigue pendiente.',
    limit:
      'Un número base antiguo puede incluir un backport. Un resultado positivo del comparador solo cubre su comparación upstream y no acredita el servidor real.',
    next: 'Conserva la referencia del proveedor y la comprobación posterior. Si no encajan origen, revisión y servicio, mantén la tarea en revisión.',
  },
  C: {
    question: '¿Qué puede alcanzar el proceso si ocurre un incidente?',
    idea: 'Los permisos y la separación de servicios ayudan a limitar el impacto. Estas defensas se revisan junto con el parche, y cada una tiene un alcance concreto.',
    steps: [
      'Identifica con qué cuenta funciona PHP y a qué recursos accede.',
      'Revisa la separación entre servicios y la exposición necesaria de cada componente.',
      'Documenta las medidas temporales, quién las mantiene y cuándo se volverán a revisar.',
    ],
    example:
      'DEMO FICTICIA · Se confirma una regla del filtro web, pero falta revisar los permisos del proceso. La evidencia solo respalda la regla del filtro.',
    limit:
      'Un WAF puede filtrar ciertas peticiones. No modifica el intérprete ni acredita que todos los vectores queden cubiertos.',
    next: 'Registra el control observado y su límite. Los cambios de permisos o configuración los coordina el responsable del entorno.',
  },
  D: {
    question: '¿Qué muestran los registros y qué información falta?',
    idea: 'Investigar consiste en relacionar señales con fecha y contexto. Un error de memoria, una caída o una petición extraña necesitan contraste antes de atribuir su causa.',
    steps: [
      'Preserva los registros disponibles y anota su intervalo, origen y zona horaria.',
      'Relaciona accesos web, errores PHP y actividad de procesos o monitorización.',
      'Distingue actividad compatible con un intento, acción no autorizada acreditada e incertidumbres.',
    ],
    example:
      'DEMO FICTICIA · Hay un POST atípico y un reinicio cercano, pero falta telemetría de procesos. La conclusión es «indicio a investigar», no «PHP2Shell confirmado».',
    limit:
      'No encontrar alertas en una fuente incompleta no descarta actividad. Acreditar una intrusión tampoco atribuye automáticamente la CVE utilizada.',
    next: 'Si hay actividad no autorizada, coordina la respuesta y la preservación con el responsable. Para practicar sin datos reales, utiliza el laboratorio.',
  },
  E: {
    question: '¿Otra persona podría revisar cómo llegaste a la conclusión?',
    idea: 'Un informe útil conecta cada afirmación con su evidencia y muestra lo que sigue sin conocerse. El porcentaje de tareas indica documentación completada.',
    steps: [
      'Resume el alcance, las fechas y los componentes revisados.',
      'Separa hechos contrastados, limitaciones y acciones pendientes con responsable.',
      'Exporta el informe, revisa su contenido y fija la siguiente comprobación.',
    ],
    example:
      'DEMO FICTICIA · «Revisada la API; pendiente el worker. La corrección de la API tiene referencia; la cobertura de logs es parcial. Siguiente acción: inventariar el worker con su responsable».',
    limit:
      'Completar las 18 tareas no convierte la web en una certificación de seguridad. La conclusión sigue dependiendo de la calidad y el alcance de las evidencias.',
    next: 'Entrega un resultado revisable con pendientes concretos. Exporta JSON para conservar los datos y HTML para leer o imprimir.',
  },
};

export const GUIDE_WALKTHROUGHS: Walkthrough[] = [
  {
    question: '¿Qué ha fallado y dónde está?',
    idea: 'PHP es el programa que ejecuta parte de la web en el servidor. PHP2Shell reúne dos fallos de ese programa. Primero entiende esa pieza; después podrás decidir qué comprobar.',
    steps: [
      'Lee el resumen del incidente y las cuatro palabras iniciales.',
      'Sigue el recorrido navegador → aplicación → PHP.',
      'Explica con tus palabras la diferencia entre tener una versión afectada y acreditar un ataque.',
    ],
    example:
      'Una web puede abrir con normalidad mientras su intérprete necesita revisión. Que la pantalla funcione no responde a la pregunta del parche.',
    limit: 'Todavía no conocemos las versiones ni el estado real de Twinteach.',
    next: 'Al terminar, deberías poder señalar dónde buscar PHP en el backend.',
  },
  {
    question: '¿Dónde tengo que mirar primero?',
    idea: 'Haz una lista de las piezas que usan PHP. «Runtime» significa el programa que ejecuta PHP; «SAPI» indica cómo se conecta con su entorno, por ejemplo mediante PHP-FPM.',
    steps: [
      'Dibuja Angular → API → Laravel/PHP como mapa inicial.',
      'Añade otros servicios PHP, colas o tareas que entren en el alcance.',
      'Anota versión web, paquete, proveedor y responsable; escribe «pendiente» cuando falte el dato.',
    ],
    example:
      'Dos filas distintas: «API web» y «tarea programada». No rellenes la segunda copiando la versión de la primera.',
    limit:
      'Sin acceso, puedes preparar las preguntas y documentar el bloqueo; no necesitas inventar resultados.',
    next: 'Abre la etapa A y completa el inventario con su evidencia o con un bloqueo explicado.',
  },
  {
    question: '¿Cómo sé qué corrección contiene mi paquete?',
    idea: 'La versión orienta, pero también importa quién distribuye PHP. Un «backport» es una corrección llevada por el proveedor a una versión anterior.',
    steps: [
      'Recoge el identificador completo del paquete y su origen.',
      'Consulta el comparador y el aviso del proveedor; revisa también el seguimiento oficial.',
      'Pide al responsable la comprobación de qué ejecuta el servicio después de actualizar.',
    ],
    example:
      'Si solo tienes «PHP 8.x», falta información. Si tienes una revisión de proveedor, contrástala con su aviso antes de clasificarla.',
    limit:
      'El comparador no consulta tu servidor y una comprobación de consola no demuestra el runtime web.',
    next: 'Deja en la etapa B una referencia del parche y otra de su uso efectivo.',
  },
  {
    question: '¿Cómo se puede limitar el impacto?',
    idea: 'Revisa a qué puede acceder el proceso PHP y cómo están separados los servicios. Son capas de defensa con una función concreta.',
    steps: [
      'Pregunta con qué cuenta funciona el servicio y qué permisos necesita.',
      'Revisa la separación entre componentes y su exposición.',
      'Anota qué control está confirmado, qué limita y qué sigue pendiente.',
    ],
    example:
      'Una regla del filtro web aporta una defensa concreta. La revisión del paquete PHP y de sus permisos continúa teniendo su propia evidencia.',
    limit:
      'No cambies permisos o configuración a ciegas. Coordina las comprobaciones y cambios con quien administra el servicio.',
    next: 'Documenta la etapa C; utiliza la lección del Aula si los términos no están claros.',
  },
  {
    question: '¿Qué puedo concluir de una señal extraña?',
    idea: 'Un log es un registro de actividad. Para interpretar una señal, necesitas saber qué ocurrió alrededor, qué fuentes cubren el periodo y cuáles faltan.',
    steps: [
      'Empieza por el primer caso ficticio del laboratorio.',
      'Relaciona acceso, error y actividad de procesos por fecha y contexto.',
      'Justifica una conclusión y escribe al menos una limitación de los datos.',
    ],
    example:
      'Un error OOM aislado significa que se agotó memoria. Sin más evidencias, no identifica la causa ni confirma una intrusión.',
    limit: 'Los ejemplos del laboratorio son inventados y no muestran el estado de Twinteach.',
    next: 'Tras practicar, documenta en la etapa D los indicios disponibles y la cobertura que falta.',
  },
  {
    question: '¿Cómo explico el resultado sin exagerarlo?',
    idea: 'Cuenta qué sabes, cómo lo sabes y qué falta. Una conclusión con límites claros ayuda a decidir el siguiente paso.',
    steps: [
      'Escribe el alcance y las fuentes de cada afirmación.',
      'Enumera pendientes con una persona o función responsable y una acción concreta.',
      'Exporta y lee el informe; revisa que las conclusiones encajen con las evidencias.',
    ],
    example:
      '«El paquete de la API está documentado; el worker sigue pendiente. La revisión de logs cubre solo parte del periodo».',
    limit:
      'Marcar un capítulo como leído registra aprendizaje; no verifica ninguna tarea de auditoría.',
    next: 'Completa la etapa E y guarda una copia del informe para revisar el seguimiento.',
  },
];

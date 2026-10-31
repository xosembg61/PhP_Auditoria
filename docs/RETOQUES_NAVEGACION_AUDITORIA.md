# Retoques de navegación, lectura y auditoría

Entrega del 28/10/2026. Trabajo local, sin publicación ni operaciones Git. El contenido técnico conserva su fecha de revisión del 26/10; esta entrega modifica la experiencia de uso.

## Navegación y presentación

La cabecera muestra Inicio, Incidente, Versiones y Explorar. El panel Explorar reúne nueve destinos en tres grupos: Entender, Practicar y Consultar. Se mantienen la búsqueda y el selector de tema. En móvil, los cuatro accesos permanecen visibles en una segunda fila.

El pie se reduce a accesos breves. Las citas repetidas de los bloques de contenido se reúnen en Fuentes junto a la bibliografía, los siete vídeos y los créditos. Los datos de referencia siguen presentes en informes y contenido; no se eliminan evidencias ni referencias documentales de las tareas.

La paleta clara utiliza superficies mates de gris verdoso, bordes más definidos y contraste de texto. La portada incorpora la fotografía real de servidores en su fondo, una segunda fotografía contextual y tarjetas de dos columnas con paneles ilustrados en CSS. No se usan imágenes generadas por IA.

Se amplían las adaptaciones de Uiverse: tarjetas de Smit-Prajapati y acabado de botones/reproducción de Adam Giebl, además del selector y regreso arriba anteriores. Se mantienen créditos y licencias MIT completas.

## Guía continua

Los seis capítulos se renderizan juntos, sin seleccionar una pantalla que oculte las demás. El índice acompaña la lectura en escritorio y los botones de continuación llevan directamente al siguiente capítulo. Cada capítulo conserva su explicación, tres acciones, ejemplo, límite, resultado y control de lectura independiente de la auditoría.

## Auditoría por comprobaciones

- Una sola tarea por pantalla: 1 de 4, 2 de 4, etc. Las etapas A/B/D tienen cuatro tareas y C/E tienen tres, conservando las 18 comprobaciones originales.
- Guardar y continuar valida y guarda antes de avanzar. Comprobada sigue exigiendo observación y evidencia; No aplica y Bloqueada exigen justificación.
- Una tarea En revisión necesita explicar qué falta para avanzar con ese estado. Dejar para después avanza sin convertir la tarea en verificada.
- Los borradores se conservan entre pasos y modos durante la visita. Hay un aviso para guardar antes de cerrar.
- El resumen distingue comprobadas con evidencia, no aplicables justificadas, bloqueadas y pendientes. No convierte el recorrido de pantallas en un porcentaje de seguridad.
- Se puede retomar una tarea concreta, consultar el estado por etapa y exportar JSON o HTML imprimible.
- Se conservan datos, modos, logros y reglas de evidencia existentes. Una revisión formada solo por No aplica no se presenta como acreditada.

## Vídeos

Siete recursos distintos, cada uno insertado una sola vez:

| Página | Recurso |
| --- | --- |
| Inicio | Curso PHP en español de midulive |
| Incidente | Conversación con investigadores de Wiz/Calif |
| Guía, inventario | Laravel in 100 Seconds, Fireship |
| Guía, defensas | Ciberseguridad para la empresa, INCIBE |
| Laboratorio | PHP2Shell Threat Briefing, watchTowr |
| Aula, recursos | PHP in 100 Seconds, Fireship |
| Aula, recursos | OpenTelemetry, IBM Technology |

Los reproductores ocupan una fila completa con proporción 16:9. Las miniaturas de YouTube se solicitan a su plataforma; el ZIP no redistribuye esos archivos. Los reproductores se activan al pulsar y no llevan autoplay. Las atribuciones, idiomas y notas distinguen contexto general de análisis específico del incidente.

Los seis identificadores de YouTube se contrastaron con su servicio oficial oEmbed; el resultado está en VERIFICACION_VIDEOS.json. En navegador se comprobó un reproductor de 1078 × 606 px y la carga del título, canal y duración del recurso en español. La sesión no permitió verificar una reproducción completa y continua del flujo de vídeo. La petición HEAD a la grabación externa MP4 devolvió 403 en esta red; no se atribuye ese resultado al navegador del propietario. Ante error del MP4, la interfaz ofrece abrir la grabación original, y cada recurso conserva acceso a su plataforma.

## Validación

- Compilación de producción correcta, sin rebasar el presupuesto configurado.
- 95 pruebas aprobadas en 16 archivos.
- Pruebas de avance solo tras guardar, validación de evidencia, resultados con 18 pendientes, retorno a una tarea concreta, borradores por modo y separación entre lectura y auditoría.
- Chrome de escritorio: portada, ambos temas, panel Explorar y formato grande de vídeo.
- Renderizado responsive real en marcos de navegador: portada y menú a 320 px, auditoría y resultados a 390 px y guía a 900 px.
- Corregido el desbordamiento del índice de etapas: el contenedor desplaza sus etapas internamente y la página conserva su anchura.
- Comprobado en navegador el avance de 1 de 4 a 2 de 4 con datos DEMO y un resumen de una comprobada y 17 pendientes.
- Verificados seis capítulos simultáneos, siete inserciones de vídeo sin repetición y ausencia de los anteriores componentes de citas en las páginas de contenido.

La prueba responsive no sustituye una revisión en dispositivos físicos o en todos los navegadores. La pantalla auxiliar de comprobación no se incluye en el ZIP.

# Actualización de tema, navegación y explicaciones

Actualización de interfaz: 28/10/2026. Se mantienen las fuentes técnicas revisadas el 26/10; no se ha realizado una nueva auditoría de avisos ni de los sistemas de Twinteach.

## Apariencia

- Botón de sol/luna en la cabecera de todas las páginas, con nombre accesible y estado de interruptor.
- Tema claro inicial, tema oscuro completo y opción «Automático · seguir el sistema» en Ayuda.
- Preferencia guardada en `php2shell:theme`, independiente de las notas y los modos de auditoría. Se sincroniza entre pestañas.
- Inicialización anterior a los estilos para recuperar el tema guardado. Si el navegador bloquea el almacenamiento, el selector funciona en memoria y explica el límite en Ayuda.
- La estructura responsive se comparte entre los dos temas; la paleta clara se limita al modo claro y la oscura se define en `appearance.css` junto con la base original.

## Navegación

- Búsqueda de títulos, resúmenes, lecciones y términos. Admite acentos y varias palabras; muestra hasta 12 resultados. No consulta ni envía notas del visitante.
- Apertura con botón o Ctrl/Cmd + K; diálogo nativo, foco inicial, cierre con Esc y enlaces recorribles con teclado.
- Indicador de página recorrida y botón para volver arriba. No modifican el progreso de aprendizaje ni las tareas.
- Al cambiar capítulo, el foco y la lectura vuelven al título correspondiente. La animación de desplazamiento respeta movimiento reducido.
- Los enlaces a otra lección del Aula también funcionan cuando el Aula ya está abierta.

## Auditoría explicativa

La introducción explica el problema del intérprete y separa la verificación del parche de la investigación de actividad. No presupone versiones, configuración o compromiso de Twinteach.

Cada una de las cinco etapas incorpora una pregunta, explicación sencilla, tres acciones, ejemplo ficticio con límites y resultado esperado. Las 18 tareas mantienen estados, evidencias, ayudas y exportaciones; ahora muestran su propósito y la evidencia esperada antes del formulario.

Cuando no hay acceso, las explicaciones orientan a documentar un bloqueo y pedir el dato al responsable. Completar una tarea sigue necesitando sus evidencias o justificaciones.

## Guía sencilla

Cada uno de los seis capítulos presenta la misma secuencia: pregunta principal, idea en lenguaje sencillo, tres acciones, ejemplo, límite y siguiente paso. El vídeo y el detalle adicional aparecen después de la explicación inicial.

La lectura se marca con «Marcar este capítulo como leído». Se conserva separada de las comprobaciones de auditoría. Los términos técnicos necesarios se explican dentro del recorrido y tienen apoyo en el Aula y el glosario.

## Uiverse

Se consultaron Uiverse y su repositorio oficial Galaxy. Se adaptaron el interruptor de JkHuger y el botón de Vinod Jangid; los créditos se muestran en Fuentes. Las licencias MIT completas y los enlaces al código original están en `LICENCIAS_UIVERSE.txt`.

Las adaptaciones incluyen tamaños, paletas, semántica de botón/estado, teclado, etiqueta en móvil y movimiento reducido. La lógica de aplicación se implementa en Angular; no se carga JavaScript de Uiverse ni se añaden dependencias.

## Validación

- 89 pruebas aprobadas en 14 archivos, incluyendo preferencia persistente, cambios del sistema, almacenamiento bloqueado, búsqueda, navegación del Aula y explicaciones de todos los capítulos y etapas.
- Compilación de producción correcta, dentro del presupuesto configurado.
- Revisión real de escritorio en ambos temas: portada, guía, auditoría, búsqueda y preferencias.
- Comprobados cambio de tema, recuperación tras recargar, Ctrl + K, búsqueda sin resultados, cierre con Esc, selección automática y salto al capítulo.
- Comprobados indicador de recorrido y posición del botón de regreso al pie de la ventana.

Pendiente de esta actualización: revisión visual a 320, 390 y 900 px en un navegador que permita cambiar el tamaño de la ventana. Esta sesión solo ofrece la vista de escritorio. La revisión responsive del 26/10 corresponde a la versión anterior y no se presenta como validación de los controles nuevos.

No se han ejecutado operaciones Git ni despliegues. El ZIP incluye código Angular, materiales, fotografías, licencias y compilación estática. El README explica cómo importarlo a la carpeta local del propietario.

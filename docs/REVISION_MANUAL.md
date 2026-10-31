# Revisión visual y funcional

Las 89 pruebas automatizadas y la compilación han pasado. Se ha realizado una revisión visual representativa en navegador: portada e incidente a 390 px, guía a 900 px y portada, incidente y auditoría a 1440 px. Se comprobó el menú móvil, el cambio de esquema del incidente y la reproducción del vídeo de Wiz. La lista siguiente conserva las comprobaciones completas pendientes; no se presenta toda la matriz como realizada.

## Inicio y navegación

- [ ] Portada a 1440 px: encabezado, hero, tres métricas y cuatro módulos sin solapamientos.
- [ ] Tablet a 900 px: tarjetas en dos columnas y paneles de trabajo apilados.
- [ ] Móvil a 390 px y 320 px: menú abre y cierra; no hay scroll horizontal global.
- [ ] Los logs y tablas se desplazan dentro de su propio contenedor.
- [ ] Tab permite llegar a enlaces, botones, formularios y ayudas; el foco es visible.
- [ ] «Saltar al contenido» lleva el foco a main.
- [ ] Hay un H1 por página y títulos ordenados.
- [ ] Recargar una ruta hash conserva la página.
- [ ] Una ruta desconocida muestra la vista 404 con regreso al inicio.

## Versiones

- [ ] 8.3.9 y 8.3.35 son anteriores a 8.3.36.
- [ ] 8.3.36, 8.4.27, 8.5.12 y 8.2.35 incluyen la corrección inicial.
- [ ] PHP 8.1 se trata como rama sin soporte oficial.
- [ ] 9.0.0 no recibe clasificación inventada.
- [ ] 8.3.x, una revisión de proveedor y una rama incompatible muestran error.
- [ ] El aviso del 23 de octubre está junto al resultado y aclara sus condiciones.
- [ ] Nunca aparece «Tu sistema es seguro».

## Checklist

- [ ] En DEMO, cargar ejemplo no marca automáticamente «Comprobada».
- [ ] «Comprobada» necesita observación y evidencia.
- [ ] «No aplica» y «Bloqueada» necesitan motivo.
- [ ] Guardar otra tarea no borra el borrador que estoy escribiendo.
- [ ] Guardar actualiza el estado y el anillo; recargar conserva el dato.
- [ ] Cambiar a PLANTILLA no copia datos DEMO.
- [ ] Todas las tareas tienen ayuda ampliable con método, evidencia y límites.
- [ ] Completar una sección con al menos una tarea comprobada desbloquea logro.
- [ ] Una sección formada solo por «No aplica» no recibe el mismo logro.
- [ ] Reabrir una tarea revierte progreso y estado visual del logro.
- [ ] Recompletar no vuelve a disparar automáticamente la celebración.
- [ ] El logro puede cerrarse y reproducirse manualmente.
- [ ] Con movimiento reducido no se reproducen partículas.
- [ ] JSON y HTML descargados contienen modo, fecha, tareas y fuentes.
- [ ] HTML se imprime o guarda en PDF con Ctrl+P.
- [ ] Reiniciar un modo no borra el otro.

## Guía y laboratorio

- [ ] Leer capítulos no marca tareas de auditoría como verificadas.
- [ ] Los enlaces de los capítulos abren el módulo correcto y la sección indicada.
- [ ] Los tres casos del laboratorio se muestran como ficticios.
- [ ] Buscar, filtrar fuente/nivel/intervalo y vaciar resultados funciona.
- [ ] Inspección y contexto explican qué no demuestra cada evento.
- [ ] La selección se conserva aunque un filtro oculte la fila.
- [ ] El histograma corresponde a los 5, 6 o 6 eventos del caso.
- [ ] Se rechaza atribuir PHP2Shell sin evidencias adicionales.
- [ ] Las pistas y la explicación final son comprensibles.
- [ ] Cambiar de caso y volver conserva la respuesta local.

## Fuentes y privacidad

- [ ] Los enlaces de fuentes abren la página oficial correspondiente.
- [ ] Ninguna pantalla afirma haber auditado realmente Twinteach.
- [ ] No se introducen datos sensibles en notas.
- [ ] Borrar progreso pide confirmación y afecta solo a esta aplicación.
- [ ] La preferencia de ayudas se conserva.

## Aula práctica e informes

- [ ] Los accesos desde portada, guía, versiones y checklist abren el aula o la lección adecuada.
- [ ] Las cuatro secciones del aula se pueden recorrer con teclado.
- [ ] Cambiar nivel conserva la misma afirmación factual y muestra el detalle técnico.
- [ ] Los bloques de consola se leen en móvil sin desbordar toda la página.
- [ ] Cada ejemplo indica qué permite y qué no permite concluir.
- [ ] Las preguntas explican el razonamiento y no completan tareas de auditoría.
- [ ] El formulario del plan exige cinco respuestas válidas y admite desconocimiento.
- [ ] Cambiar una respuesta oculta el plan anterior hasta regenerarlo.
- [ ] Con actividad no autorizada, la primera acción es coordinar respuesta y preservar evidencia.
- [ ] El plan y la solicitud descargan correctamente como Markdown.
- [ ] Las dos descargas de materiales abren archivos con acentos, tablas y ejemplos legibles.
- [ ] El informe HTML imprime o se guarda en PDF con Ctrl+P.
- [ ] Las fuentes externas abren la documentación primaria correcta.

## Multimedia e incidente ampliado

- [x] Portada e incidente a 390 px sin desbordamiento horizontal.
- [x] Menú móvil abre, navega al incidente y se cierra.
- [x] Los tres esquemas cambian la explicación sin modificar tareas de auditoría (pruebas automáticas).
- [x] El reproductor no existe antes de pulsar y desaparece al ocultarlo (pruebas automáticas).
- [x] El vídeo de Wiz reproduce imagen y avanza dentro del incidente.
- [x] Fotografía de portada y logotipo PHP cargan desde archivos incluidos.
- [ ] Reproducir los otros tres recursos en el navegador del propietario.
- [ ] Comprobar todas las rutas y sus estados a 320, 390, 900 y 1440 px.
- [ ] Comprobar impresión del informe desde el navegador del propietario.

Se comprobó el laboratorio a 320 px después de corregir el contenedor de tabla: la tabla conserva su desplazamiento interno sin ampliar la página.

Actualización 28/10: consultar ACTUALIZACION_TEMA_Y_GUIA.md para los dos temas, búsqueda y nuevas explicaciones. La revisión visual actual es de escritorio; quedan pendientes los tamaños de móvil y tablet para los controles nuevos.

La versión vigente cambia a lectura continua y auditoría por pasos. La revisión responsive y multimedia de esta entrega está documentada en RETOQUES_NAVEGACION_AUDITORIA.md; las listas anteriores se conservan como registro de versiones previas.

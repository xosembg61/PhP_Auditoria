# Ampliación didáctica · 26/10/2026

Se ha ampliado la aplicación Angular existente manteniendo el trabajo en local.

## Qué se añadió

- Aula práctica accesible desde portada, guía, pie, comprobador y ayudas de la checklist.
- Seis lecciones con explicación sencilla y técnica, objetivo, analogía y sus límites, pasos, evidencia esperada y errores frecuentes.
- Ejemplos interpretados: consola, runtime web, backports, cambio del runtime, correlación de logs y redacción de conclusiones.
- Ejemplo documental de Ubuntu 22.04 LTS para los dos CVE iniciales, con versión exacta y fuentes del proveedor. No se presenta como inspección del servidor.
- Preguntas de comprensión con explicación de cada respuesta; no modifican los estados de auditoría.
- Plan orientativo con cinco preguntas sobre acceso, alojamiento, parche, actividad y cobertura de registros.
- El plan prioriza coordinación de respuesta y preservación cuando se declara actividad no autorizada, y adapta pasos a hosting, Linux, contenedores y acceso de estudiante.
- Descarga del plan en Markdown y plantilla de solicitud al responsable. La aplicación no envía mensajes.
- Cuatro ejercicios de evidencia y feedback razonado.
- Guía sencilla Markdown e informe HTML detallado, imprimible o guardable como PDF desde el navegador.
- Lecturas primarias comentadas: PHP, PHP Foundation, Ubuntu, Laravel, AWS y OWASP.

## Cómo probarlo

1. Instala la versión actualizada y abre la aplicación local.
2. Desde el inicio, pulsa **Entrar al aula**.
3. Lee una lección y alterna **En sencillo / Con detalle técnico**.
4. Revisa el ejemplo y su límite antes de completar una tarea.
5. En **Resolver mi caso**, responde también «No lo sé» cuando corresponda.
6. En **Informes y lecturas**, descarga los dos materiales.
7. Usa el checklist para documentar datos reales de una revisión autorizada; el aula no lo hace automáticamente.

## Mantenimiento

Los informes se generan desde las mismas lecciones y datos locales de la aplicación:

```powershell
npm.cmd run export:guides
```

`npm run build` los regenera antes de compilar. Se guardan en `public/materiales` y se incluyen en la salida estática. Son archivos sin scripts ni dependencias externas.

El ejemplo de backport es una referencia fechada. Antes de una actuación real, hay que volver a consultar el proveedor y revisar la aplicabilidad del aviso de sesiones del 23 de octubre.

## Validación

**72 pruebas automáticas / 9 archivos aprobados** y compilación de producción correcta. Las pruebas cubren las rutas, formularios y reglas anteriores más las 384 combinaciones válidas del plan, rechazo de respuestas incompletas, ausencia de cambios en la auditoría desde el aula, fuentes y generación de materiales.

La revisión visual real de escritorio, tablet y móvil sigue pendiente por falta de conexión entre el navegador de verificación y el servidor local del entorno. No se ha publicado ni ejecutado Git.

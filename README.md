# PHP2Shell · Centro de aprendizaje y auditoría

Aplicación **Angular 22 real**, TypeScript y CSS, creada siguiendo la especificación Markdown proporcionada. Funciona en el navegador, sin backend ni escaneos remotos.

## Estado de entrega

- Código terminado y compilación de producción comprobada.
- **79 pruebas automáticas aprobadas**: comparación de versiones, reglas de evidencia, logros, persistencia, aislamiento de modos, casos del laboratorio, formularios y todas las rutas.
- Revisión editorial con fuentes primarias el **26 de octubre de 2026**.
- Revisión visual real: portada e incidente a 390 px, guía a 900 px, laboratorio a 320 px y portada, incidente y auditoría a 1440 px. Reproducción del vídeo de Wiz comprobada. La lista manual conserva otras comprobaciones pendientes.
- Sin commit, push ni publicación. No existe workflow activo de despliegue.
- El proyecto original indicado por el propietario no se ha modificado, porque estaba fuera de las rutas de escritura del entorno.

## Aplicar a la carpeta del propietario

Ruta indicada en esta sesión:

```text
C:\Users\Miguel\Documents\GitHub\PhP_Auditoria
```

El archivo **Importar_En_Proyecto.ps1** copia el código a esa carpeta y guarda primero los archivos sustituidos en `.php2shell-backups/<fecha>`. Conserva `.git`, `node_modules` y la configuración del editor. No hace operaciones de Git ni despliega.

Revisa el script y ejecútalo desde PowerShell 7:

```powershell
pwsh -NoProfile -File .\Importar_En_Proyecto.ps1 -Destination "C:\Users\Miguel\Documents\GitHub\PhP_Auditoria"
```

Si estás en clase, cambia únicamente el valor de `-Destination` por la ruta real. Para aplicar los cambios, cierra antes el servidor de desarrollo del proyecto de destino.

## Iniciar en local

Dentro de la carpeta del proyecto:

```powershell
npm.cmd ci
npm.cmd start -- --port 4201
```

Abre **http://localhost:4201/**. Si ya están instaladas las dependencias del proyecto original y no han cambiado, se puede omitir `npm ci`.

## Validar y compilar

```powershell
npm.cmd run test:ci
npm.cmd run build
npm.cmd run preview
```

La vista de producción queda en **http://127.0.0.1:4201/**. Detén primero `ng serve` si ocupa ese puerto. La salida estática está en `dist/PhP_Auditoria/browser/`.

El script de pruebas usa una carpeta temporal dentro del proyecto para evitar restricciones de permisos de Windows. El de compilación limpia exclusivamente los bundles generados del directorio de salida y prepara ese directorio antes de ejecutar Angular.

## Funciones

- Portada con acceso a los cuatro módulos principales.
- Tema claro con fotografías reales, colores alegres y recursos audiovisuales repartidos según el contexto.
- Incidente ampliado: glosario inicial, analogía, tres esquemas de memoria, descubrimiento, consecuencias, preguntas frecuentes y pasos por perfil.
- Incidente y alcance transversal: frameworks, CMS, tiendas, código propio y procesos auxiliares.
- Cronología interactiva, dos CVE y explicaciones sencilla/técnica.
- Comparador numérico upstream con ramas desconocidas, versiones sin soporte y límites de backport.
- Seguimiento oficial del **23 de octubre** sobre session upload progress.
- Guía de seis capítulos; lectura y comprobaciones con progreso distinto.
- Checklist Twinteach: **18 tareas, cinco secciones**, ayudas ampliables, notas, evidencias y cinco estados.
- Modos DEMO y PLANTILLA separados, guardado local, recuperación de datos corruptos y funcionamiento en memoria si falla el almacenamiento.
- Logros de sección con animación, reversión del progreso y prevención de celebraciones duplicadas.
- Exportación JSON e informe HTML imprimible; notas escapadas al generar HTML.
- Laboratorio: tres escenarios sintéticos, filtros, inspección, contexto, selección, hipótesis, pistas, feedback e histograma calculado.
- Glosario, preferencias de ayuda, borrado de progreso con confirmación.
- Rutas hash y base relativa para alojamiento estático.
- CSS responsive, foco visible, controles nativos, enlace de salto y movimiento reducido.

## Criterios de interpretación

La aplicación **no ha auditado Twinteach**. Solo conoce Angular y Laravel por el enunciado. No conoce sus versiones, configuración, registros ni estado de compromiso.

El comprobador compara números escritos, sin verificar el servidor ni los paquetes del proveedor. Las versiones del 21 de octubre son las primeras corregidas para los dos CVE iniciales, no una garantía global de seguridad. El aviso adicional del día 23 aparece junto al resultado.

El laboratorio es ficticio. Su evaluación comprueba selección, conclusión y presencia de una justificación; **no valida automáticamente la calidad semántica de un texto libre**.

Las notas de la checklist se guardan al pulsar **Guardar tarea**. No introduzcas secretos ni datos personales.

## Estructura

- `src/app/content/`: fuentes, cronología, versiones, checklist y casos.
- `src/app/core/`: almacenamiento, progreso, comparación y exportación.
- `src/app/shared/`: iconos SVG, ayudas, logros, anillo y tarea de auditoría.
- `src/app/pages/`: páginas y navegación.
- `scripts/`: compilación, pruebas y vista local de producción.
- `docs/`: trazabilidad, revisión manual y publicación posterior.

## Siguiente paso

Aplica el código a tu carpeta y completa las comprobaciones pendientes de `docs/REVISION_MANUAL.md`. Después puedes seguir `docs/PUBLICAR_GITHUB_PAGES.md`. La plantilla de workflow está en `docs/deploy-pages.yml.example` y no se ejecuta mientras permanezca allí.

## Ampliación didáctica

El Aula práctica reúne seis lecciones por niveles, preguntas explicadas, cuatro ejercicios de evidencia, un plan orientativo según cinco respuestas y lecturas primarias comentadas. Accede desde portada, guía o el pie.

Incluye dos materiales listos para descargar en public/materiales: PHP2Shell_Guia_Sencilla.md y PHP2Shell_Informe_Detallado.html. El informe HTML permite imprimir o guardar en PDF con Ctrl+P. Se regeneran automáticamente al compilar; npm run export:guides los actualiza por separado.

El plan y la solicitud al responsable se descargan localmente. No envían mensajes, no revisan servidores y no completan tareas de auditoría.

Detalles: docs/MEJORAS_APRENDIZAJE.md. Créditos, licencias y distribución multimedia: docs/RECURSOS_VISUALES.md.

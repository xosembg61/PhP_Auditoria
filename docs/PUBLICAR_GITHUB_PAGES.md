# Publicar en GitHub Pages cuando decidas hacerlo

**Esta entrega no se ha publicado.** Estos pasos son una guía para más adelante, después de aplicar el código y revisar la web localmente.

## 1. Revisar y comprobar

Desde tu carpeta real del repositorio:

```powershell
npm.cmd ci
npm.cmd run test:ci
npm.cmd run build
npm.cmd run preview
```

Abre la dirección local que imprime la terminal y revisa la lista de `REVISION_MANUAL.md`. Detén el servidor con Ctrl+C.

El contenido que se publica es educativo. Las notas guardadas por el visitante permanecen en su navegador; no forman parte de los archivos del sitio. Comprueba que no has añadido por accidente informes privados al repositorio.

## 2. Preparar el workflow

Copia el archivo `docs/deploy-pages.yml.example` a `.github/workflows/deploy-pages.yml`.

La plantilla utiliza únicamente **workflow_dispatch**: la publicación se lanza manualmente desde Actions. No contiene un disparador de publicación automática por push.

El nombre del repositorio se toma de GitHub para calcular la ruta base de un sitio de proyecto. Si tu repositorio se llama exactamente `USUARIO.github.io`, cambia el argumento a `--base-href="/"`.

## 3. Subir el código cuando ya quieras hacerlo

En GitHub Desktop, selecciona este repositorio, revisa los cambios, escribe un mensaje de commit y pulsa Commit y Push origin.

Alternativamente, revisa y ejecuta tú los comandos Git desde el repositorio. No añadas `node_modules`, `.angular`, `dist` ni los respaldos locales; ya están ignorados.

No necesitas escribir credenciales en ningún archivo del proyecto.

## 4. Activar GitHub Pages

En el repositorio de GitHub:

1. Entra en **Settings → Pages**.
2. En **Build and deployment → Source**, selecciona **GitHub Actions**.
3. En **Actions**, selecciona **Publicar PHP2Shell en Pages**.
4. Pulsa **Run workflow** en la rama donde guardaste el código.
5. Espera a que pasen comprobaciones, compilación y despliegue.
6. Abre la URL que muestra la ejecución.

La URL habitual de un sitio de proyecto es `https://USUARIO.github.io/NOMBRE-REPOSITORIO/`. Sustituye ambos datos por los reales; esta guía no conoce tu cuenta ni el remoto.

## 5. Verificación pública

- Inicio, estilos e iconos cargan.
- Abre `#/versiones`, compara 8.3.35 y 8.3.36 y recarga.
- Comprueba que el resultado incluye el aviso del 23 de octubre.
- Abre auditoría, guarda una tarea DEMO y comprueba que PLANTILLA sigue vacía.
- Recarga una ruta como `#/laboratorio`: debe seguir abriéndose.
- Revisa móvil y navegación por teclado.
- Confirma que la URL del proyecto contiene el nombre exacto del repositorio.
- Anota en la entrega académica la URL de Pages.

Si la portada abre pero los scripts fallan, revisa el `base-href` y que el workflow sube `dist/PhP_Auditoria/browser`. La aplicación usa hash para que las recargas no dependan de reescrituras del servidor.

Fuente: [GitHub Docs — custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

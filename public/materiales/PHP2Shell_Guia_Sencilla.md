# PHP2Shell · Guía sencilla de comprensión y resolución

Revisión: 2026-10-26

Material educativo. No es una auditoría de Twinteach. Los ejemplos identificados como DEMO son ficticios.

## La idea en un minuto

El componente que debes comprobar es el intérprete PHP usado por cada servicio. Actualizar solo Angular, Laravel o un CMS no acredita su corrección. Verifica paquete, proveedor, servicio efectivo y procesos; después investiga la actividad con evidencia.

## El recorrido

### 1. Dónde está realmente el fallo

PHP ejecuta el backend. Si falla el intérprete, actualizar solo Angular o Laravel deja esa pieza sin comprobar.

**Objetivo:** Separar frontend, aplicación e intérprete antes de decidir qué actualizar.

**Qué anotar:** Arquitectura conceptual; marca como desconocido lo que no esté verificado. Origen del runtime y función responsable. Lo que se conoce, lo que se supone y lo que falta comprobar.

**Idea que debes evitar:** El frontend está actualizado, así que PHP2Shell está resuelto.

**Corrección:** Falta verificar PHP en el backend y el resto de servicios que lo ejecutan.

### 2. Encontrar el PHP que sirve la web

Puede haber varios PHP en el mismo servidor. La consola, PHP-FPM, Apache y un contenedor no tienen por qué compartir versión o configuración.

**Objetivo:** No confundir una salida de consola con una comprobación del servicio HTTP.

**Qué anotar:** Entorno, SAPI, proveedor y fecha. Etiqueta expresamente el resultado como CLI. Paquete efectivo, versión, SAPI y referencia administrativa.

**Idea que debes evitar:** php -v muestra una versión corregida: todo el servidor está actualizado.

**Corrección:** Comprueba el runtime HTTP, workers y otras instancias por separado.

### 3. Leer versiones sin caer en falsos positivos

El número base de PHP no cuenta toda la historia. Una distribución puede incorporar el parche sin cambiar a la primera versión corregida publicada por PHP.

**Objetivo:** Distinguir un mínimo upstream de una revisión de paquete del proveedor.

**Qué anotar:** Versión completa y procedencia. Enlaces, release y revisión corregida consultada. Fecha, servicio y evidencia de uso del paquete.

**Idea que debes evitar:** Toda versión 8.1.2 carece necesariamente de parche.

**Corrección:** El soporte upstream y la revisión corregida de un proveedor son preguntas diferentes.

### 4. Aplicar una corrección y comprobarla

Instalar el paquete es una parte del trabajo. También hay que renovar los procesos pertinentes, revisar otras instancias y verificar el servicio después del cambio.

**Objetivo:** Entender qué debe cambiar y qué evidencia permite cerrar la actualización.

**Qué anotar:** Alcance y función responsable, sin inventar personas. Registro del cambio y lista de instancias cubiertas. Hora, comprobación y entornos que sigan pendientes. Condiciones revisadas y medida correspondiente.

**Idea que debes evitar:** Un WAF equivale al parche.

**Corrección:** Puede reducir exposición a determinadas peticiones; no cambia el intérprete instalado.

### 5. Relacionar logs sin inventar una intrusión

Un error no explica por sí solo su causa. Combina fuentes, comprueba cobertura temporal y conserva alternativas antes de concluir.

**Objetivo:** Separar una anomalía, un indicio de compromiso y la atribución a una CVE.

**Qué anotar:** Qué puedes investigar y qué no. Hechos observados y explicaciones alternativas. Grado de certeza, límites y siguiente acción.

**Idea que debes evitar:** No hay eventos en laravel.log: no hubo ataque.

**Corrección:** Puede haber otros canales, huecos de cobertura o errores previos a la aplicación.

### 6. Convertir los datos en un informe útil

Un informe separa alcance, hechos, incertidumbres y acciones. La seguridad no se resume con el porcentaje de casillas.

**Objetivo:** Entregar una conclusión que permita decidir y que otra persona pueda contrastar.

**Qué anotar:** Responsable por función y fecha de revisión. Pendiente, comprobado o investigando, con el motivo. Qué hará falta para dar la acción por cerrada.

**Idea que debes evitar:** 18 casillas marcadas equivalen a 100 % de seguridad.

**Corrección:** Miden documentación de tareas; las conclusiones dependen de su evidencia y alcance.

## Primeras correcciones upstream del 21/10/2026

| Rama | Primera versión corregida |
|---|---|
| 8.5 | 8.5.12 |
| 8.4 | 8.4.27 |
| 8.3 | 8.3.36 |
| 8.2 | 8.2.35 |

Estos mínimos no detectan backports. Revisa también el seguimiento PHP del 23/10/2026. No equivalen a una garantía de seguridad.

## Si no administras el servidor

Pide al responsable: versión y SAPI web, revisión de paquete, referencias de los dos CVE, procesos renovados, seguimiento de sesiones y cobertura de registros. No solicites contraseñas.

## Cómo concluir

Separa estado del parche y actividad histórica. Escribe qué revisaste, qué evidencia tienes, qué falta y cuál es la próxima acción.

## Fuentes primarias

- [Avisos de seguridad de PHP](https://www.php.net/archive/2026.php) · 21 y 23 oct 2026
- [Cómo se descubrieron y corrigieron los fallos](https://thephp.foundation/blog/2026/10/21/todays-php-security-release-and-how-were-strengthening-php-security/) · 21 oct 2026
- [Intentos previos a la divulgación en MadPot](https://aws.amazon.com/blogs/security/amazon-threat-intelligence-identifies-php2shell-exploitation-prior-to-public-disclosure-in-madpot/) · 21 oct 2026
- [SAPI: cómo se ejecuta PHP](https://www.php.net/manual/en/function.php-sapi-name.php) · Consulta: 26 oct 2026
- [Estado del paquete para CVE-2026-109618](https://ubuntu.com/security/CVE-2026-109618) · Consulta: 26 oct 2026
- [Estado del paquete para CVE-2026-109619](https://ubuntu.com/security/CVE-2026-109619) · Consulta: 26 oct 2026

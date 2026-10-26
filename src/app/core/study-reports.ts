import { LESSONS, EVIDENCE_DRILLS } from '../content/learning';
import { PATCHES } from '../content/incident';
import { TASKS, SECTIONS } from '../content/audit';
import { REFERENCES, REVIEW_DATE } from '../content/references';
const esc = (v: string) =>
  v.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  );
export function simpleStudyGuide(): string {
  return (
    '# PHP2Shell · Guía sencilla de comprensión y resolución\n\nRevisión: ' +
    REVIEW_DATE +
    '\n\nMaterial educativo. No es una auditoría de Twinteach. Los ejemplos identificados como DEMO son ficticios.\n\n## La idea en un minuto\n\nEl componente que debes comprobar es el intérprete PHP usado por cada servicio. Actualizar solo Angular, Laravel o un CMS no acredita su corrección. Verifica paquete, proveedor, servicio efectivo y procesos; después investiga la actividad con evidencia.\n\n## El recorrido\n\n' +
    LESSONS.map(
      (l, i) =>
        '### ' +
        (i + 1) +
        '. ' +
        l.title +
        '\n\n' +
        l.short +
        '\n\n**Objetivo:** ' +
        l.goal +
        '\n\n**Qué anotar:** ' +
        l.steps.map((s) => s.record).join(' ') +
        '\n\n**Idea que debes evitar:** ' +
        l.mistakes[0].claim +
        '\n\n**Corrección:** ' +
        l.mistakes[0].correction +
        '\n',
    ).join('\n') +
    '\n## Primeras correcciones upstream del 21/10/2026\n\n| Rama | Primera versión corregida |\n|---|---|\n' +
    Object.entries(PATCHES)
      .map(([b, v]) => '| ' + b + ' | ' + v + ' |')
      .join('\n') +
    '\n\nEstos mínimos no detectan backports. Revisa también el seguimiento PHP del 23/10/2026. No equivalen a una garantía de seguridad.\n\n## Si no administras el servidor\n\nPide al responsable: versión y SAPI web, revisión de paquete, referencias de los dos CVE, procesos renovados, seguimiento de sesiones y cobertura de registros. No solicites contraseñas.\n\n## Cómo concluir\n\nSepara estado del parche y actividad histórica. Escribe qué revisaste, qué evidencia tienes, qué falta y cuál es la próxima acción.\n\n## Fuentes primarias\n\n' +
    REFERENCES.filter((s) =>
      ['php', 'foundation', 'sapi', 'ubuntu-oom', 'ubuntu-state', 'aws'].includes(s.id),
    )
      .map((s) => '- [' + s.title + '](' + s.url + ') · ' + s.date)
      .join('\n') +
    '\n'
  );
}
export function detailedStudyReport(): string {
  const sources = REFERENCES.map(
    (s) =>
      '<li><a href="' +
      esc(s.url) +
      '">' +
      esc(s.title) +
      '</a> · ' +
      esc(s.org) +
      ' · ' +
      esc(s.date) +
      '</li>',
  ).join('');
  const lessons = LESSONS.map(
    (l, i) =>
      '<section><h2 id="' +
      l.id +
      '">' +
      (i + 1) +
      '. ' +
      esc(l.title) +
      '</h2><p class="goal">' +
      esc(l.goal) +
      '</p><h3>Explicación sencilla</h3><p>' +
      esc(l.short) +
      '</p><p><strong>Modelo mental:</strong> ' +
      esc(l.analogy) +
      '</p><p><strong>Límite de la analogía:</strong> ' +
      esc(l.limit) +
      '</p><h3>Detalles técnicos</h3>' +
      l.technical.map((p) => '<p>' + esc(p) + '</p>').join('') +
      '<h3>Cómo trabajar el paso</h3><ol>' +
      l.steps
        .map(
          (s) =>
            '<li><strong>' +
            esc(s.title) +
            '</strong><p>' +
            esc(s.action) +
            '</p><p>Buscar: ' +
            esc(s.lookFor) +
            '</p><p>Documentar: ' +
            esc(s.record) +
            '</p></li>',
        )
        .join('') +
      '</ol><h3>' +
      esc(l.example.label) +
      '</h3>' +
      (l.example.command ? '<pre>' + esc(l.example.command) + '</pre>' : '') +
      '<pre>' +
      esc(l.example.output) +
      '</pre><p><strong>Interpretación:</strong> ' +
      esc(l.example.means) +
      '</p><p><strong>No demuestra:</strong> ' +
      esc(l.example.doesNot) +
      '</p><h3>Errores frecuentes</h3><ul>' +
      l.mistakes
        .map((m) => '<li><strong>' + esc(m.claim) + '</strong> ' + esc(m.correction) + '</li>')
        .join('') +
      '<p>Fuentes: ' +
      l.sources
        .map((id) => {
          const r = REFERENCES.find((s) => s.id === id);
          return r ? '<a href="' + esc(r.url) + '">' + esc(r.org) + '</a>' : '';
        })
        .join(' · ') +
      '</p></section>',
  ).join('');
  const checklist = SECTIONS.map(
    (s) =>
      '<h3>' +
      s.id +
      '. ' +
      esc(s.title) +
      '</h3><table><thead><tr><th>Tarea</th><th>Evidencia esperada</th><th>Error que evitar</th></tr></thead><tbody>' +
      TASKS.filter((t) => t.section === s.id)
        .map(
          (t) =>
            '<tr><td>' +
            esc(t.id + ' · ' + t.title) +
            '</td><td>' +
            esc(t.evidence) +
            '</td><td>' +
            esc(t.mistake) +
            '</td></tr>',
        )
        .join('') +
      '</tbody></table>',
  ).join('');
  return (
    '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PHP2Shell · Informe didáctico detallado</title><style>body{font:16px/1.7 system-ui;color:#18324a;max-width:950px;margin:40px auto;padding:0 24px}h1,h2,h3{line-height:1.25;color:#092a41}h1{font-size:36px}h2{font-size:27px;margin-top:42px}h3{font-size:20px}a{color:#0a6084}pre{white-space:pre-wrap;overflow-wrap:anywhere;background:#edf4f8;padding:18px;border:1px solid #c5d7e3;font:13px/1.65 Consolas,monospace}table{border-collapse:collapse;width:100%;font-size:13px}td,th{border:1px solid #b7cbd9;text-align:left;vertical-align:top;padding:10px}.goal,aside{padding:16px;border-left:4px solid #147d91;background:#edf5f8}section{border-top:1px solid #c5d7e3;margin-top:32px;padding-top:12px}@media print{body{margin:0;max-width:none;font-size:11pt}h2,h3{break-after:avoid}pre,tr{break-inside:avoid}a{color:inherit}}</style></head><body><h1>PHP2Shell · Informe didáctico detallado</h1><p>Material educativo · Revisión: ' +
    REVIEW_DATE +
    '</p><aside>Este documento explica un método. No certifica sistemas ni contiene resultados reales de Twinteach. Las salidas ficticias se etiquetan como tales. El ejemplo Ubuntu es una referencia documental del proveedor, no una inspección del servidor.</aside><h2>Índice</h2><ol>' +
    LESSONS.map((l) => '<li><a href="#' + l.id + '">' + esc(l.title) + '</a></li>').join('') +
    '</ol>' +
    lessons +
    '<section><h2>Lista de evidencias de las 18 tareas</h2>' +
    checklist +
    '</section><section><h2>Ejercicios resueltos</h2>' +
    EVIDENCE_DRILLS.map(
      (d) =>
        '<h3>' +
        esc(d.title) +
        '</h3><p>' +
        esc(d.evidence) +
        '</p><p><strong>Pregunta:</strong> ' +
        esc(d.question) +
        '</p><p><strong>Interpretación:</strong> ' +
        esc(d.feedback) +
        '</p>',
    ).join('') +
    '</section><section><h2>Fuentes primarias y lecturas</h2><ul>' +
    sources +
    '</ul></section><p>Para imprimir o guardar en PDF, utiliza Ctrl+P en tu navegador.</p></body></html>'
  );
}

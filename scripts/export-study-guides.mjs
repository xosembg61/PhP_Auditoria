import { buildSync } from 'esbuild';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const work = join(root, '.angular', 'study-guides');
mkdirSync(work, { recursive: true });
const built = buildSync({
  entryPoints: [join(root, 'src', 'app', 'core', 'study-reports.ts')],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  write: false,
});
const modulePath = join(work, 'reports.cjs');
writeFileSync(modulePath, built.outputFiles[0].text);
const require = createRequire(import.meta.url);
const reports = require(modulePath);
const output = join(root, 'public', 'materiales');
mkdirSync(output, { recursive: true });
writeFileSync(join(output, 'PHP2Shell_Guia_Sencilla.md'), reports.simpleStudyGuide(), 'utf8');
writeFileSync(
  join(output, 'PHP2Shell_Informe_Detallado.html'),
  reports.detailedStudyReport(),
  'utf8',
);
console.log('Material didactico exportado: guia sencilla e informe detallado.');

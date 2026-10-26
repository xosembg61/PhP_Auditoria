import { mkdirSync, readdirSync, unlinkSync } from 'node:fs';
import { dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = join(root, 'dist', 'PhP_Auditoria', 'browser');
if (!output.startsWith(root + sep)) throw new Error('Salida fuera del proyecto');
mkdirSync(output, { recursive: true });
for (const entry of readdirSync(output, { withFileTypes: true })) {
  if (entry.isFile() && /^(?:chunk-|main-|styles-).+\.(?:js|css)(?:\.map)?$/.test(entry.name))
    unlinkSync(join(output, entry.name));
}
const result = spawnSync(
  process.execPath,
  [
    join(root, 'node_modules', '@angular', 'cli', 'bin', 'ng.js'),
    'build',
    '--delete-output-path=false',
    ...process.argv.slice(2),
  ],
  { cwd: root, stdio: 'inherit' },
);
if (result.error) throw result.error;
process.exit(result.status ?? 1);

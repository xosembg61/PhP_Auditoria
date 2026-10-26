import { mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const temp = join(root, '.angular', 'test-temp');
mkdirSync(temp, { recursive: true });
const result = spawnSync(
  process.execPath,
  [
    join(root, 'node_modules', '@angular', 'cli', 'bin', 'ng.js'),
    'test',
    '--watch=false',
    ...process.argv.slice(2),
  ],
  { cwd: root, stdio: 'inherit', env: { ...process.env, TEMP: temp, TMP: temp } },
);
if (result.error) throw result.error;
process.exit(result.status ?? 1);

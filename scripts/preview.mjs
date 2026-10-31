import { createServer } from 'node:http';
import { execFile } from 'node:child_process';
import { readFile, stat } from 'node:fs/promises';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../dist/PhP_Auditoria/browser');
const port = Number(process.env['PHP2SHELL_PREVIEW_PORT'] || 4201);
const openBrowser = process.argv.includes('--open');
let triedAnotherPort = false;
if (!Number.isInteger(port) || port < 0 || port > 65535) {
  console.error('El puerto debe ser un numero entre 0 y 65535.');
  process.exit(1);
}
try {
  await stat(resolve(root, 'index.html'));
} catch {
  console.error('Falta la web compilada. Extrae todo el ZIP antes de abrir ABRIR_WEB.cmd.');
  console.error('Si estas desarrollando, ejecuta npm.cmd run build.');
  process.exit(1);
}
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.md': 'text/markdown; charset=utf-8',
};
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', 'http://localhost');
    const name = decodeURIComponent(url.pathname);
    const path = resolve(root, '.' + (name === '/' ? '/index.html' : name));
    if (!path.startsWith(root + sep)) {
      res.writeHead(403).end();
      return;
    }
    const info = await stat(path);
    if (!info.isFile()) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, {
      'Content-Type': types[extname(path)] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-store',
    });
    res.end(await readFile(path));
  } catch {
    res.writeHead(404).end('Archivo no encontrado. Ejecuta npm run build y abre la ruta raiz.');
  }
});
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE' && !triedAnotherPort) {
    triedAnotherPort = true;
    console.log('El puerto esta ocupado. Buscando otro puerto libre...');
    server.listen(0, '127.0.0.1');
    return;
  }
  console.error(error.message);
  process.exitCode = 1;
});
server.on('listening', () => {
  const address = server.address();
  const url = 'http://127.0.0.1:' + address.port + '/';
  console.log('PHP2Shell - ' + url);
  console.log('Deja esta ventana abierta mientras usas la web. Ctrl+C para cerrar.');
  if (openBrowser && process.platform === 'win32') {
    execFile('cmd.exe', ['/d', '/c', 'start', '', url], { windowsHide: true }, (error) => {
      if (error) console.log('Abre esta direccion en el navegador: ' + url);
    });
  }
});
server.listen(port, '127.0.0.1');

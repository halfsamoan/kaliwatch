// Optional local preview server. index.html also works when opened directly from disk.
const http = require('node:http'), fs = require('node:fs'), path = require('node:path');
const root = __dirname, port = Number(process.env.VAULT_PORT) || 4179;
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.cjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.webm': 'video/webm', '.ttf': 'font/ttf', '.json': 'application/json; charset=utf-8', '.md': 'text/plain; charset=utf-8' };
http.createServer((req, res) => {
  let relative; try { relative = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname); } catch { res.writeHead(400); res.end(); return; }
  const file = path.resolve(root, '.' + (relative === '/' ? '/index.html' : relative));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
  fs.readFile(file, (error, data) => {
    if (error) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(data);
  });
}).listen(port, '127.0.0.1', () => console.log(`KALIWATCH Celestial Vault studio: http://127.0.0.1:${port}`));

const fs = require('fs');
const path = require('path');
const { serveFile, serve404, serve500 } = require('../utils/file');
const { readBody, parseUrlEncoded, escapeHtml } = require('../utils/body');

function handleContactoGet(req, res, pathname, method) {
  if (pathname === '/contacto' && method === 'GET') {
    serveFile(path.join(__dirname, '../../public/contacto.html'), res);
    return true;
  }
  if (pathname === '/contacto/listar' && method === 'GET') {
    const f = path.join(__dirname, '../../data/consultas.txt');
    fs.readFile(f, 'utf8', (err, content) => {
      if (err) {
        // Si no existe aún, muestro mensaje de no hay consultas
        if (err.code === 'ENOENT') {
          const html = `<!DOCTYPE html><html lang="es"><head>
<meta charset="UTF-8"><title>Consultas</title>
<link rel="stylesheet" href="/estilos.css"></head><body>
<header><h1>AgroTrack</h1></header>
<main><h2>Consultas recibidas</h2><p>Aún no hay consultas.</p>
<p><a href="/contacto">Volver</a></p></main><footer><p>&copy; 2025 AgroTrack | By Pablo Tomatis</p></footer></body></html>`;
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(html);
          return;
        }
        return serve500(res);
      }
      const html = `<!DOCTYPE html><html lang="es"><head>
<meta charset="UTF-8"><title>Consultas</title>
<link rel="stylesheet" href="/estilos.css"></head><body>
<header><h1>AgroTrack</h1></header>
<main><h2>Consultas recibidas</h2>
<pre>${escapeHtml(content)}</pre>
<p><a href="/contacto">Volver</a></p></main><footer><p>&copy; 2025 AgroTrack | By Pablo Tomatis</p></footer></body></html>`;
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    });
    return true;
  }
  return false;
}

async function handleContactoPost(req, res, pathname, method) {
  if (pathname === '/contacto/cargar' && method === 'POST') {
    try {
      const body = await readBody(req);
      const p = parseUrlEncoded(body);
      const nombre = p.get('nombre') || '';
      const email  = p.get('email') || '';
      const mensaje= p.get('mensaje') || '';

      const now = new Date();
      const fecha = now.toISOString().replace('T', ' ').slice(0, 16);

      const entrada =
`-------------------------
Fecha: ${fecha}
Nombre: ${nombre}
Email: ${email}
Mensaje: ${mensaje}
-------------------------\n`;

      const f = path.join(__dirname, '../../data/consultas.txt');
      fs.mkdir(path.dirname(f), { recursive: true }, (err) => {
        if (err) return serve500(res);
        fs.appendFile(f, entrada, (err2) => {
          if (err2) return serve500(res);
          const html = `<!DOCTYPE html><html lang="es"><head>
<meta charset="UTF-8"><title>Contacto</title>
<link rel="stylesheet" href="/estilos.css"></head><body>
<header><h1>AgroTrack</h1></header>
<main><h2>¡Gracias!</h2>
<p>Tu consulta fue registrada correctamente.</p>
<p><a href="/contacto">Volver</a> · <a href="/contacto/listar">Ver consultas</a></p>
</main><footer><p>&copy; 2025 AgroTrack | By Pablo Tomatis</p></footer></body></html>`;
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(html);
        });
      });
      return true;
    } catch {
      serve500(res);
      return true;
    }
  }
  return false;
}

module.exports = { handleContactoGet, handleContactoPost };

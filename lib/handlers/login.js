const path = require('path');
const { serveFile, serve500 } = require('../utils/file');
const { readBody, parseUrlEncoded, escapeHtml } = require('../utils/body');

async function handleLogin(req, res, pathname, method) {
  // GET /login
  if (pathname === '/login' && method === 'GET') {                      // muestra el formulario de login
    serveFile(path.join(__dirname, '../../public/login.html'), res);
    return true;
  }

  // POST /auth/recuperar
  if (pathname === '/auth/recuperar' && method === 'POST') {            // procesa el formulario de login
    try {
      const body = await readBody(req);
      const params = parseUrlEncoded(body);
      const usuario = escapeHtml(params.get('usuario') || '');
      const clave   = escapeHtml(params.get('clave') || '');

      const html =
`<!DOCTYPE html><html lang="es"><head>                                    // respuesta con los datos recibidos
<meta charset="UTF-8"><title>Login recibido</title>
<link rel="stylesheet" href="/estilos.css">
</head><body>
<header><h1>AgroTrack</h1>
<nav>
  <a href="/index.html">Inicio</a>
  <a href="/productos.html">Productos</a>
  <a href="/contacto.html">Contacto</a>
  <a href="/login.html" class="activo">Login</a>
</nav></header>
<main><section><h2>Datos recibidos</h2><pre>
Usuario: ${usuario}
Clave: ${clave}
</pre><p><a href="/login">Volver al login</a> · <a href="/">Inicio</a></p>
</section></main>
<footer><p>&copy; 2025 AgroTrack | By Pablo Tomatis</p></footer>
</body></html>`;
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
      return true;
    } catch (e) {
      if (e && e.message === 'PAYLOAD_TOO_LARGE') {
        res.writeHead(413, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>413 - Payload demasiado grande</h1>');
        return true;
      }
      serve500(res);
      return true;
    }
  }

  return false; // no matchea rutas de login
}

module.exports = { handleLogin };   // exportamos la funcion handleLogin

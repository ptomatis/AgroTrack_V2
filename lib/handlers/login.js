const path = require('path');
const { escapeHtml } = require('../utils/body');

// GET /login - muestra el formulario de login
function handleLoginGet(req, res) {
  res.sendFile('login.html', { root: './public' });
}

// POST /auth/recuperar - procesa el formulario de login
function handleLoginPost(req, res) {
  try {
    // Express ya parseó el body automáticamente con el middleware urlencoded
    const usuario = escapeHtml(req.body.usuario || '');
    const clave   = escapeHtml(req.body.clave || '');

    const html =
`<!DOCTYPE html><html lang="es"><head>
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
    res.send(html);
  } catch (e) {
    console.error('Error en handleLoginPost:', e);
    res.status(500).sendFile('500.html', { root: './public' }, (err) => {
      if (err) res.status(500).send('<h1>Error 500</h1>');
    });
  }
}

// Handler unificado que funciona para GET y POST según la ruta
function handleLogin(req, res) {
  if (req.method === 'GET') {
    handleLoginGet(req, res);
  } else if (req.method === 'POST') {
    handleLoginPost(req, res);
  }
}

module.exports = { handleLogin, handleLoginGet, handleLoginPost };

const fs = require('fs');
const path = require('path');
const { escapeHtml } = require('../utils/body');

// GET /contacto - muestra el formulario de contacto
function handleContactoGet(req, res) {
  res.sendFile('contacto.html', { root: './public' });
}

// GET /contacto/listar - lista las consultas recibidas
function handleContactoListar(req, res) {
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
        res.send(html);
        return;
      }
      // Error al leer el archivo
      res.status(500).sendFile('500.html', { root: './public' }, (fileErr) => {
        if (fileErr) res.status(500).send('<h1>Error 500</h1>');
      });
      return;
    }
    const html = `<!DOCTYPE html><html lang="es"><head>
<meta charset="UTF-8"><title>Consultas</title>
<link rel="stylesheet" href="/estilos.css"></head><body>
<header><h1>AgroTrack</h1></header>
<main><h2>Consultas recibidas</h2>
<pre>${escapeHtml(content)}</pre>
<p><a href="/contacto">Volver</a></p></main><footer><p>&copy; 2025 AgroTrack | By Pablo Tomatis</p></footer></body></html>`;
    res.send(html);
  });
}

// POST /contacto/cargar - procesa el formulario de contacto
function handleContactoPost(req, res) {
  try {
    // Express ya parseó el body automáticamente
    const nombre = req.body.nombre || '';
    const email  = req.body.email || '';
    const mensaje= req.body.mensaje || '';

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
      if (err) {
        res.status(500).sendFile('500.html', { root: './public' }, (fileErr) => {
          if (fileErr) res.status(500).send('<h1>Error 500</h1>');
        });
        return;
      }
      fs.appendFile(f, entrada, (err2) => {
        if (err2) {
          res.status(500).sendFile('500.html', { root: './public' }, (fileErr) => {
            if (fileErr) res.status(500).send('<h1>Error 500</h1>');
          });
          return;
        }
        const html = `<!DOCTYPE html><html lang="es"><head>
<meta charset="UTF-8"><title>Contacto</title>
<link rel="stylesheet" href="/estilos.css"></head><body>
<header><h1>AgroTrack</h1></header>
<main><h2>¡Gracias!</h2>
<p>Tu consulta fue registrada correctamente.</p>
<p><a href="/contacto">Volver</a> · <a href="/contacto/listar">Ver consultas</a></p>
</main><footer><p>&copy; 2025 AgroTrack | By Pablo Tomatis</p></footer></body></html>`;
        res.send(html);
      });
    });
  } catch (e) {
    console.error('Error en handleContactoPost:', e);
    res.status(500).sendFile('500.html', { root: './public' }, (fileErr) => {
      if (fileErr) res.status(500).send('<h1>Error 500</h1>');
    });
  }
}

module.exports = { handleContactoGet, handleContactoListar, handleContactoPost };

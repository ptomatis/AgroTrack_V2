const { escapeHtml } = require('../utils/body');
const db = require('../db');
const { validateContacto } = require('../utils/validation');

// GET /contacto - muestra el formulario de contacto
function handleContactoGet(req, res) {
  res.sendFile('contacto.html', { root: './public' });
}

// GET /contacto/listar - lista las consultas recibidas
async function handleContactoListar(req, res, next) {
  try {
    // Obtener todas las consultas ordenadas por fecha (más recientes primero)
    const consultas = await db.query(
      'SELECT id, nombre, email, mensaje, fecha FROM contactos ORDER BY fecha DESC'
    );

    if (consultas.length === 0) {
      const html = `<!DOCTYPE html><html lang="es"><head>
<meta charset="UTF-8"><title>Consultas</title>
<link rel="stylesheet" href="/estilos.css"></head><body>
<header><h1>AgroTrack</h1></header>
<main><h2>Consultas recibidas</h2><p>Aún no hay consultas.</p>
<p><a href="/contacto">Volver</a></p></main><footer><p>&copy; 2025 AgroTrack | By Pablo Tomatis</p></footer></body></html>`;
      res.send(html);
      return;
    }

    // Formatear las consultas similar al formato anterior del archivo
    let contenido = '';
    consultas.forEach(consulta => {
      const fecha = new Date(consulta.fecha).toISOString().replace('T', ' ').slice(0, 16);
      contenido += `-------------------------
Fecha: ${fecha}
Nombre: ${consulta.nombre}
Email: ${consulta.email}
Mensaje: ${consulta.mensaje}
-------------------------\n`;
    });

    const html = `<!DOCTYPE html><html lang="es"><head>
<meta charset="UTF-8"><title>Consultas</title>
<link rel="stylesheet" href="/estilos.css"></head><body>
<header><h1>AgroTrack</h1></header>
<main><h2>Consultas recibidas</h2>
<pre>${escapeHtml(contenido)}</pre>
<p><a href="/contacto">Volver</a></p></main><footer><p>&copy; 2025 AgroTrack | By Pablo Tomatis</p></footer></body></html>`;
    res.send(html);
  } catch (error) {
    next(error); // Pasar el error al middleware de manejo de errores
  }
}

// POST /contacto/cargar - procesa el formulario de contacto
async function handleContactoPost(req, res, next) {
  try {
    // Express ya parseó el body automáticamente
    const nombre = req.body.nombre || '';
    const email = req.body.email || '';
    const mensaje = req.body.mensaje || '';

    // Validar los datos usando el módulo de validación
    const validation = validateContacto({ nombre, email, mensaje });

    if (!validation.isValid) {
      // Crear mensaje de error descriptivo
      const errorMessages = validation.errors.join('. ');
      const html = `<!DOCTYPE html><html lang="es"><head>
<meta charset="UTF-8"><title>Contacto - Error</title>
<link rel="stylesheet" href="/estilos.css"></head><body>
<header><h1>AgroTrack</h1></header>
<main><h2>Error de Validación</h2>
<p>${escapeHtml(errorMessages)}</p>
<p><a href="/contacto">Volver al formulario</a></p>
</main><footer><p>&copy; 2025 AgroTrack | By Pablo Tomatis</p></footer></body></html>`;
      
      const error = new Error(errorMessages);
      error.statusCode = 400;
      error.errors = validation.errors;
      // Enviar respuesta HTML para errores de validación en formularios web
      return res.status(400).send(html);
    }

    // Insertar en la base de datos (los datos ya están validados)
    await db.query(
      'INSERT INTO contactos (nombre, email, mensaje) VALUES (?, ?, ?)',
      [nombre.trim(), email.trim(), mensaje.trim()]
    );

    const html = `<!DOCTYPE html><html lang="es"><head>
<meta charset="UTF-8"><title>Contacto</title>
<link rel="stylesheet" href="/estilos.css"></head><body>
<header><h1>AgroTrack</h1></header>
<main><h2>¡Gracias!</h2>
<p>Tu consulta fue registrada correctamente.</p>
<p><a href="/contacto">Volver</a> · <a href="/contacto/listar">Ver consultas</a></p>
</main><footer><p>&copy; 2025 AgroTrack | By Pablo Tomatis</p></footer></body></html>`;
    res.send(html);
  } catch (error) {
    next(error); // Pasar el error al middleware de manejo de errores
  }
}

module.exports = { handleContactoGet, handleContactoListar, handleContactoPost };

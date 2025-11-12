// Middleware para manejar rutas no encontradas (404)
function handleNotFound(req, res) {
  res.status(404).sendFile('404.html', { root: './public' }, (err) => {
    if (err) {
      res.status(404).send('<h1>404 - Página no encontrada</h1><a href="/">Volver al inicio</a>');
    }
  });
}

module.exports = { handleNotFound };

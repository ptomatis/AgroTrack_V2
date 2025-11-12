const express = require('express');  // Framework web para Node.js
const { setupRoutes } = require('./lib/router');   // Importamos la funcion que configura las rutas

const app = express();  // Creamos la aplicación Express
const PORT = 8888;      // Aca seteamos el puerto del servidor.

// Middleware para parsear el body de las peticiones POST (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true, limit: '50kb' }));

// Configuramos las rutas de la aplicación
setupRoutes(app);

// Middleware para manejar errores no controlados
app.use((err, req, res, next) => {
  console.error('Error no controlado:', err);
  res.status(500).sendFile('500.html', { root: './public' }, (fileErr) => {
    if (fileErr) {
      res.status(500).send('<h1>Error 500</h1>');
    }
  });
});

// Iniciamos el servidor
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

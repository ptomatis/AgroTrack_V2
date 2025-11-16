// Cargar variables de entorno desde .env
require('dotenv').config();

const express = require('express');  // Framework web para Node.js
const { setupRoutes } = require('./lib/router');   // Importamos la funcion que configura las rutas
const logger = require('./lib/middleware/logger');  // Middleware de logger
const { errorHandler, notFoundHandler } = require('./lib/middleware/errorHandler');  // Middleware de manejo de errores

const app = express();  // Creamos la aplicación Express
const PORT = process.env.PORT || 8888;      // Puerto del servidor desde .env o por defecto 8888

// Middleware de logger (debe ir antes de las rutas)
app.use(logger);

// Middleware para parsear el body de las peticiones POST
app.use(express.json({
  // Manejar errores de parsing JSON y traducirlos al español
  verify: (req, res, buf) => {
    try {
      JSON.parse(buf);
    } catch (e) {
      const error = new Error('El formato JSON de la solicitud no es válido');
      error.statusCode = 400;
      throw error;
    }
  }
})); // Para parsear application/json
app.use(express.urlencoded({ extended: true, limit: '50kb' })); // Para parsear application/x-www-form-urlencoded

// Middleware para capturar errores de parsing JSON de Express
app.use((err, req, res, next) => {
  // Si es un error de parsing JSON de Express
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    const error = new Error('El formato JSON de la solicitud no es válido');
    error.statusCode = 400;
    return next(error);
  }
  next(err);
});

// Configuramos las rutas de la aplicación
setupRoutes(app);

// Middleware para manejar rutas no encontradas (404)
app.use(notFoundHandler);

// Middleware centralizado para manejar errores (debe ir al final)
app.use(errorHandler);

// Iniciamos el servidor
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

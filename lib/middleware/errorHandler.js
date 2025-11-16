// Middleware centralizado para manejo de errores

/**
 * Middleware centralizado para manejar errores
 * Debe ser el último middleware en la cadena
 */
function errorHandler(err, req, res, next) {
  // Log del error
  console.error('Error capturado por errorHandler:', {
    message: err.message,
    stack: err.stack,
    method: req.method,
    path: req.path,
    body: req.body,
    timestamp: new Date().toISOString()
  });

  // Si la respuesta ya fue enviada, delegar al handler por defecto de Express
  if (res.headersSent) {
    return next(err);
  }

  // Determinar si es una petición a la API (comienza con /api)
  const isApiRequest = req.path.startsWith('/api');

  // Si es una petición a la API, devolver JSON
  if (isApiRequest) {
    // Errores de parsing JSON
    if (err instanceof SyntaxError || err.message.includes('JSON')) {
      return res.status(400).json({
        success: false,
        message: 'El formato JSON de la solicitud no es válido',
        errors: ['Por favor verifica que el JSON esté correctamente formateado']
      });
    }

    // Errores de validación (400)
    if (err.statusCode === 400 || err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: err.message || 'Error de validación',
        errors: err.errors || []
      });
    }

    // Errores de base de datos
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'El registro ya existe en la base de datos'
      });
    }

    // Errores de sintaxis SQL
    if (err.code && err.code.startsWith('ER_')) {
      return res.status(500).json({
        success: false,
        message: 'Error en la base de datos',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Error interno del servidor'
      });
    }

    // Error genérico 500
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  // Para peticiones web (HTML), devolver página de error
  const statusCode = err.statusCode || 500;
  
  if (statusCode === 400) {
    // Error 400 - Bad Request
    return res.status(400).sendFile('400.html', { root: './public' }, (fileErr) => {
      if (fileErr) {
        res.status(400).send(`
          <!DOCTYPE html>
          <html lang="es">
          <head><meta charset="UTF-8"><title>Error 400</title></head>
          <body><h1>Error 400 - Solicitud Incorrecta</h1><p>${err.message || 'La solicitud contiene datos inválidos'}</p></body>
          </html>
        `);
      }
    });
  }

  // Error 500 - Internal Server Error
  res.status(500).sendFile('500.html', { root: './public' }, (fileErr) => {
    if (fileErr) {
      res.status(500).send(`
        <!DOCTYPE html>
        <html lang="es">
        <head><meta charset="UTF-8"><title>Error 500</title></head>
        <body><h1>Error 500 - Error Interno del Servidor</h1></body>
        </html>
      `);
    }
  });
}

/**
 * Middleware para manejar rutas no encontradas (404)
 */
function notFoundHandler(req, res, next) {
  const isApiRequest = req.path.startsWith('/api');
  
  if (isApiRequest) {
    return res.status(404).json({
      success: false,
      message: `Ruta no encontrada: ${req.method} ${req.path}`
    });
  }
  
  // Para rutas web, devolver página 404
  res.status(404).sendFile('404.html', { root: './public' }, (err) => {
    if (err) {
      res.status(404).send(`
        <!DOCTYPE html>
        <html lang="es">
        <head><meta charset="UTF-8"><title>Error 404</title></head>
        <body><h1>404 - Página no encontrada</h1><p>La página que buscas no existe.</p><a href="/">Volver al inicio</a></body>
        </html>
      `);
    }
  });
}

module.exports = {
  errorHandler,
  notFoundHandler
};


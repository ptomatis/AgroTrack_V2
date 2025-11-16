const path = require('path');
const express = require('express');
const { handleLoginGet, handleLoginPost } = require('./handlers/login');                              // Manejo de login
const { handleContactoGet, handleContactoListar, handleContactoPost } = require('./handlers/contacto'); // Manejo de contacto
const { getContactos, createContacto } = require('./handlers/contacto-api'); // API REST de contactos

function setupRoutes(app) {
  // 1) Ruta raíz -> index.html (debe ir antes de archivos estáticos)
  app.get('/', (req, res) => {
    res.sendFile('index.html', { root: './public' });
  });

  // 2) Rutas de aplicación (dinámicas)
  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      port: process.env.PORT || 8888
    });
  });

  // Login
  app.get('/login', handleLoginGet);
  app.post('/auth/recuperar', handleLoginPost);
  
  // Contacto (interfaz web)
  app.get('/contacto', handleContactoGet);
  app.get('/contacto/listar', handleContactoListar);
  app.post('/contacto/cargar', handleContactoPost);

  // API REST de Contactos
  app.get('/api/contactos', getContactos);
  app.post('/api/contactos', createContacto);

  // 3) Archivos estáticos - Express maneja esto automáticamente
  app.use(express.static(path.join(__dirname, '../public')));

  // Nota: El 404 se maneja en server.js con notFoundHandler del middleware de errores
}

module.exports = { setupRoutes };

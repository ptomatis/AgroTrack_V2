const path = require('path');
const express = require('express');
const { handleLoginGet, handleLoginPost } = require('./handlers/login');                              // Manejo de login
const { handleContactoGet, handleContactoListar, handleContactoPost } = require('./handlers/contacto'); // Manejo de contacto
const { handleNotFound } = require('./handlers/errors');                          // Manejo de errores 404

function setupRoutes(app) {
  // 1) Ruta raíz -> index.html (debe ir antes de archivos estáticos)
  app.get('/', (req, res) => {
    res.sendFile('index.html', { root: './public' });
  });

  // 2) Rutas de aplicación (dinámicas)
  // Login
  app.get('/login', handleLoginGet);
  app.post('/auth/recuperar', handleLoginPost);
  
  // Contacto
  app.get('/contacto', handleContactoGet);
  app.get('/contacto/listar', handleContactoListar);
  app.post('/contacto/cargar', handleContactoPost);

  // 3) Archivos estáticos - Express maneja esto automáticamente
  app.use(express.static(path.join(__dirname, '../public')));

  // 4) Si nada matchea → 404 (debe ir al final)
  app.use(handleNotFound);
}

module.exports = { setupRoutes };

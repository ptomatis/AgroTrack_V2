// Handlers para la API REST de contactos
const db = require('../db');
const { validateContacto } = require('../utils/validation');

// GET /api/contactos - Lista todas las consultas de contacto
async function getContactos(req, res, next) {
  try {
    const contactos = await db.query(
      'SELECT id, nombre, email, mensaje, fecha FROM contactos ORDER BY fecha DESC'
    );

    res.status(200).json({
      success: true,
      count: contactos.length,
      data: contactos
    });
  } catch (error) {
    next(error); // Pasar el error al middleware de manejo de errores
  }
}

// POST /api/contactos - Registra una nueva consulta de contacto
async function createContacto(req, res, next) {
  try {
    const { nombre, email, mensaje } = req.body;

    // Validar los datos usando el módulo de validación
    const validation = validateContacto({ nombre, email, mensaje });

    if (!validation.isValid) {
      const error = new Error('Error de validación');
      error.statusCode = 400;
      error.errors = validation.errors;
      error.message = validation.errors.join(', ');
      return next(error);
    }

    // Insertar en la base de datos (los datos ya están validados y trimmeados)
    const result = await db.query(
      'INSERT INTO contactos (nombre, email, mensaje) VALUES (?, ?, ?)',
      [nombre.trim(), email.trim(), mensaje.trim()]
    );

    // Obtener el contacto recién creado
    const [contacto] = await db.query(
      'SELECT id, nombre, email, mensaje, fecha FROM contactos WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Consulta de contacto registrada exitosamente',
      data: contacto
    });
  } catch (error) {
    next(error); // Pasar el error al middleware de manejo de errores
  }
}

module.exports = {
  getContactos,
  createContacto
};


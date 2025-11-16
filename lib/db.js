// Módulo de conexión a la base de datos MySQL
require('dotenv').config();
const mysql = require('mysql2/promise');

// Crear pool de conexiones para mejor rendimiento
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'agrotrack',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Función para obtener una conexión del pool
async function getConnection() {
  return await pool.getConnection();
}

// Función para ejecutar queries
async function query(sql, params) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Error en query:', error);
    throw error;
  }
}

// Función para cerrar el pool (útil para tests o shutdown)
async function close() {
  await pool.end();
}

module.exports = {
  pool,
  getConnection,
  query,
  close
};


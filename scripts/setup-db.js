// Script para ejecutar el schema.sql y crear la base de datos
require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  let connection;
  
  try {
    // Conectar a MySQL (sin especificar base de datos, para poder crearla)
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true // Permite ejecutar múltiples sentencias SQL
    });

    console.log('✅ Conectado a MySQL');

    // Leer el archivo schema.sql
    const schemaPath = path.join(__dirname, '../sql/schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

    console.log('📄 Leyendo schema.sql...');

    // Ejecutar el script SQL
    await connection.query(schemaSQL);
    
    console.log('✅ Base de datos "agrotrack" creada exitosamente');
    console.log('✅ Tabla "contactos" creada exitosamente');
    console.log('🎉 Setup de base de datos completado');

  } catch (error) {
    console.error('❌ Error al ejecutar el schema:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Conexión cerrada');
    }
  }
}

// Ejecutar la función
setupDatabase();


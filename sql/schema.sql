-- Script de creación de la base de datos agrotrack y tabla contactos
-- Ejecutar este script en MySQL para crear la estructura de la base de datos

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS agrotrack;

-- Usar la base de datos
USE agrotrack;

-- Crear la tabla contactos
CREATE TABLE IF NOT EXISTS contactos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_fecha (fecha),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Comentarios sobre la tabla
-- id: Identificador único autoincremental
-- nombre: Nombre del contacto (máximo 100 caracteres)
-- email: Correo electrónico del contacto (máximo 255 caracteres)
-- mensaje: Mensaje del contacto (texto largo)
-- fecha: Fecha y hora de creación del registro (se establece automáticamente)


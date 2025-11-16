// Utilidades de validación

/**
 * Valida el formato de un email
 * @param {string} email - Email a validar
 * @returns {boolean} - true si el email es válido
 */
function isValidEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  // Expresión regular para validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Valida los datos de contacto
 * @param {object} data - Datos a validar {nombre, email, mensaje}
 * @returns {object} - {isValid: boolean, errors: string[]}
 */
function validateContacto(data) {
  const errors = [];
  const { nombre, email, mensaje } = data;

  // Validar que todos los campos estén presentes
  if (!nombre) {
    errors.push('El campo nombre es requerido');
  } else if (!nombre.trim()) {
    errors.push('El campo nombre no puede estar vacío');
  }

  if (!email) {
    errors.push('El campo email es requerido');
  } else if (!email.trim()) {
    errors.push('El campo email no puede estar vacío');
  } else if (!isValidEmail(email)) {
    errors.push('El formato del email no es válido');
  }

  if (!mensaje) {
    errors.push('El campo mensaje es requerido');
  } else if (!mensaje.trim()) {
    errors.push('El campo mensaje no puede estar vacío');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

module.exports = {
  isValidEmail,
  validateContacto
};


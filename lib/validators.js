// lib/validators.js
// ✅ Validaciones centralizadas y reutilizables

/**
 * Valida que un texto solo contenga letras y espacios
 * @param {string} value - Texto a validar
 * @param {number} maxLength - Longitud máxima (default: 50)
 * @returns {string} Mensaje de error o string vacío si es válido
 */
export const validateNombre = (value, maxLength = 50) => {
  if (!value || !value.trim()) {
    return "Este campo es obligatorio";
  }
  
  const regex = new RegExp(`^[A-Za-zÁÉÍÓÚáéíóúÑñ\\s]{1,${maxLength}}$`);
  if (!regex.test(value)) {
    return `Solo letras y espacios (máx ${maxLength} caracteres)`;
  }
  
  return "";
};

/**
 * Valida formato de correo electrónico
 * @param {string} value - Correo a validar
 * @param {string} domain - Dominio requerido (opcional, ej: "duoc.cl")
 * @returns {string} Mensaje de error o string vacío si es válido
 */
export const validateCorreo = (value, domain = null) => {
  if (!value || !value.trim()) {
    return "El correo es obligatorio";
  }
  
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(value)) {
    return "Debe ser un correo electrónico válido";
  }
  
  if (domain && !value.endsWith(`@${domain}`)) {
    return `Debe ser un correo válido con dominio @${domain}`;
  }
  
  return "";
};

/**
 * Valida que dos valores coincidan (ej: confirmar correo/password)
 * @param {string} value1 - Primer valor
 * @param {string} value2 - Segundo valor
 * @param {string} fieldName - Nombre del campo para el mensaje
 * @returns {string} Mensaje de error o string vacío si coinciden
 */
export const validateMatch = (value1, value2, fieldName = "Los valores") => {
  if (value1 !== value2) {
    return `${fieldName} no coinciden`;
  }
  return "";
};

/**
 * Valida contraseña segura
 * @param {string} value - Contraseña a validar
 * @returns {string} Mensaje de error o string vacío si es válida
 */
export const validatePassword = (value) => {
  if (!value) {
    return "La contraseña es obligatoria";
  }
  
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,}$/;
  
  if (!passwordRegex.test(value)) {
    return "Debe tener al menos 8 caracteres, incluir mayúscula, minúscula, número y símbolo";
  }
  
  return "";
};

/**
 * Valida teléfono chileno (formato: 9XXXXXXXX)
 * @param {string} value - Teléfono a validar
 * @param {boolean} required - Si es obligatorio
 * @returns {string} Mensaje de error o string vacío si es válido
 */
export const validateTelefono = (value, required = false) => {
  if (!value || !value.trim()) {
    return required ? "El teléfono es obligatorio" : "";
  }
  
  if (!/^9\d{8}$/.test(value)) {
    return "Debe ser un número válido, ej: 912345678";
  }
  
  return "";
};

/**
 * Valida dirección (no vacía si es requerida)
 * @param {string} value - Dirección a validar
 * @param {boolean} required - Si es obligatoria
 * @returns {string} Mensaje de error o string vacío si es válida
 */
export const validateDireccion = (value, required = false) => {
  if (required && (!value || !value.trim())) {
    return "La dirección es obligatoria";
  }
  return "";
};

/**
 * Valida que un select tenga una opción seleccionada
 * @param {string} value - Valor seleccionado
 * @param {string} fieldName - Nombre del campo
 * @returns {string} Mensaje de error o string vacío si es válido
 */
export const validateSelect = (value, fieldName = "Este campo") => {
  if (!value || value === "") {
    return `${fieldName} es obligatorio`;
  }
  return "";
};

/**
 * Valida checkbox de términos y condiciones
 * @param {boolean} checked - Estado del checkbox
 * @returns {string} Mensaje de error o string vacío si está marcado
 */
export const validateTerminos = (checked) => {
  if (!checked) {
    return "Debes aceptar los términos y condiciones";
  }
  return "";
};

/**
 * Valida carrito de compras
 * @param {Array} items - Items del carrito
 * @returns {string} Mensaje de error o string vacío si es válido
 */
export const validateCart = (items) => {
  if (!items || items.length === 0) {
    return "Tu carrito está vacío";
  }
  return "";
};
// hooks/useFormValidation.js
import { useState } from "react";

/**
 * Hook personalizado para manejar validaciones de formularios
 * Reutilizable en registroUsuario, checkout y otros formularios
 */
export function useFormValidation(initialState, validationRules) {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅

  /**
   * Valida un campo específico
   */
  const validateField = (name, value) => {
    const rule = validationRules[name];
    if (!rule) return "";

    // Si el campo es condicional y no aplica, no validar
    if (rule.condition && !rule.condition(formData)) {
      return "";
    }

    // Ejecutar la validación
    if (rule.validator) {
      return rule.validator(value, formData);
    }

    return "";
  };

  /**
   * Valida todo el formulario
   */
  const validateForm = () => {
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Maneja cambios en inputs
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Validación en tiempo real si el campo ya fue tocado
    if (touched[name]) {
      const error = validateField(name, newValue);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  /**
   * Maneja cuando el input pierde el foco
   */
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const error = validateField(name, formData[name]);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  /**
   * Marca todos los campos como tocados (útil en submit)
   */
  const touchAllFields = () => {
    const allTouched = {};
    Object.keys(formData).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
  };

  /**
   * Reinicia el formulario
   */
  const resetForm = () => {
    setFormData(initialState);
    setErrors({});
    setTouched({});
  };

  return {
    formData,
    errors,
    touched,
    isSubmitting,      
    setIsSubmitting,
    handleChange,
    handleBlur,
    validateForm,
    touchAllFields,
    resetForm,
    setFormData,
    setErrors,
  };
}

// ============================================
// VALIDADORES REUTILIZABLES
// ============================================

export const validators = {
  nombre: (value) => {
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,50}$/.test(value)) {
      return "Solo letras y espacios (máx 50 caracteres)";
    }
    return "";
  },

  correo: (value) => {
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
      return "Debe ser un correo electrónico válido";
    }
    return "";
  },

  correoDuoc: (value) => {
    if (!/^[a-zA-Z0-9._%+-]+@duoc\.cl$/.test(value)) {
      return "Debe ser un correo válido con dominio @duoc.cl";
    }
    return "";
  },

  correoConfirmacion: (value, formData) => {
    if (value !== formData.correo) {
      return "Los correos no coinciden";
    }
    return "";
  },

  password: (value) => {
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,}$/.test(
        value
      )
    ) {
      return "Debe tener al menos 8 caracteres, incluir mayúscula, minúscula, número y símbolo";
    }
    return "";
  },

  passwordConfirmacion: (value, formData) => {
    if (value !== formData.password) {
      return "Las contraseñas no coinciden";
    }
    return "";
  },

  telefono: (value) => {
    if (value && !/^9\d{8}$/.test(value)) {
      return "Debe ser un número válido, ej: 912345678";
    }
    return "";
  },

  required: (value) => {
    if (!value || value.toString().trim() === "") {
      return "Este campo es obligatorio";
    }
    return "";
  },

  direccion: (value, formData, metodo) => {
    if (metodo === "domicilio" && !value.trim()) {
      return "La dirección es obligatoria para envío a domicilio";
    }
    return "";
  },

  checkbox: (value) => {
    if (!value) {
      return "Debes aceptar los términos";
    }
    return "";
  },
};

// ============================================
// REGLAS DE VALIDACIÓN PREDEFINIDAS
// ============================================

/**
 * Reglas para formulario de registro
 */
export const registroValidationRules = {
  nombreCompleto: {
    validator: validators.nombre,
  },
  correo: {
    validator: validators.correoDuoc,
  },
  verificarCorreo: {
    validator: validators.correoConfirmacion,
  },
  password: {
    validator: validators.password,
  },
  verificarPassword: {
    validator: validators.passwordConfirmacion,
  },
  telefono: {
    validator: validators.telefono,
  },
  region: {
    validator: validators.required,
  },
  comuna: {
    validator: validators.required,
  },
  terminos: {
    validator: validators.checkbox,
  },
};

/**
 * Reglas para formulario de checkout
 */
export const checkoutValidationRules = (metodo) => ({
  nombre: {
    validator: validators.nombre,
  },
  apellidos: {
    validator: validators.nombre,
  },
  correo: {
    validator: validators.correo,
  },
  verificarCorreo: {
    validator: validators.correoConfirmacion,
  },
  calle: {
    condition: (formData) => metodo === "domicilio",
    validator: (value) => validators.direccion(value, null, metodo),
  },
  region: {
    condition: (formData) => metodo === "domicilio",
    validator: validators.required,
  },
  comuna: {
    condition: (formData) => metodo === "domicilio",
    validator: validators.required,
  },
});
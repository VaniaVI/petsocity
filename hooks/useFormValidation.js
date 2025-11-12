import { useState } from "react";
// ✅ Importamos las funciones puras desde la librería central de validadores
import {
  validateNombre,
  validateCorreo, // Usamos esta para crear validateCorreoDuoc
  validateMatch,
  validatePassword,
  validateTelefono,
  validateSelect, // Usamos esta para crear validateSelectRequired
  validateTerminos,
} from "@/lib/validators"; 


// ============================================
// FUNCIONES ADAPTABLES (Wrappers)
// Se definen aquí porque son específicas de la regla de negocio (ej. dominio @duoc.cl)
// ============================================

/**
 * Wrapper para validar que el correo sea @duoc.cl
 */
const validateCorreoDuoc = (value) => validateCorreo(value, "duoc.cl");

/**
 * Wrapper para validar que un campo de selección (select) sea obligatorio
 */
const validateSelectRequired = (value, fieldName) => validateSelect(value, fieldName);


// ============================================
// REGLAS DE VALIDACIÓN DECLARATIVAS
// ============================================

/**
 * Reglas para formulario de registro
 */
export const registroValidationRules = {
  nombreCompleto: {
    validator: validateNombre,
  },
  correo: {
    validator: validateCorreoDuoc, // Usamos el wrapper
  },
  verificarCorreo: {
    // Usamos el validador puro, pasándole los valores que deben coincidir
    validator: (value, formData) => validateMatch(formData.correo, value, "Los correos"),
  },
  password: {
    validator: validatePassword,
  },
  verificarPassword: {
    // Usamos el validador puro
    validator: (value, formData) => validateMatch(formData.password, value, "Las contraseñas"),
  },
  telefono: {
    // Usamos el validador puro, especificando que NO es requerido (false)
    validator: (value) => validateTelefono(value, false),
  },
  region: {
    validator: (value) => validateSelectRequired(value, "La región"), // Usamos el wrapper
  },
  comuna: {
    validator: (value) => validateSelectRequired(value, "La comuna"), // Usamos el wrapper
  },
  terminos: {
    validator: validateTerminos,
  },
};


// ============================================
// HOOK PRINCIPAL
// ============================================

/**
 * Hook personalizado para manejar validaciones de formularios
 * Reutilizable en registroUsuario, checkout y otros formularios
 */
export function useFormValidation(initialState, validationRules) {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false); 

  /**
   * Valida un campo específico contra las reglas.
   */
  const validateField = (name, value) => {
    const rule = validationRules[name];
    if (!rule) return "";

    // Manejo de reglas condicionales (ej. campos solo si aplica una condición)
    if (rule.condition && !rule.condition(formData)) {
      return "";
    }

    // Ejecuta la función validadora (el primer argumento es el valor del campo
    // y el segundo es el estado completo del formulario)
    if (rule.validator) {
      return rule.validator(value, formData);
    }
    return "";
  };

  /**
   * Valida todo el formulario y actualiza el estado 'errors'.
   */
  const validateForm = () => {
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      // Usar el valor actual del estado
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    // Retorna true si no hay errores
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Maneja el cambio en un input, con validación en tiempo real si el campo ya fue tocado.
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    const updatedFormData = {
      ...formData,
      [name]: newValue,
    };
    setFormData(updatedFormData);

    // Solo validar en tiempo real si ya se ha interactuado con el campo (touched)
    if (touched[name]) {
      // 1. Revalida el campo actual con el nuevo valor
      const error = validateField(name, newValue);
      
      // 2. Manejo de campos dependientes (ej. si cambia 'correo', revalido 'verificarCorreo')
      const dependentErrors = {};
      const confirmationFieldName = name === 'correo' ? 'verificarCorreo' : (name === 'password' ? 'verificarPassword' : null);

      if (confirmationFieldName) {
          const rule = validationRules[confirmationFieldName];
          if(rule) {
              // Revalida el campo de confirmación usando los datos actualizados
              dependentErrors[confirmationFieldName] = rule.validator(updatedFormData[confirmationFieldName], updatedFormData);
          }
      }

      setErrors((prev) => ({
        ...prev,
        ...dependentErrors, 
        [name]: error,
      }));
    }
  };

  /**
   * Maneja cuando el input pierde el foco (blur), marcando como 'tocado' y validando.
   */
  const handleBlur = (e) => {
    const { name } = e.target;
    
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Valida el campo usando el valor actual de formData
    const error = validateField(name, formData[name]);
    
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  /**
   * Marca todos los campos como tocados (útil en el submit para forzar la visualización de todos los errores).
   */
  const touchAllFields = () => {
    const allTouched = {};
    Object.keys(formData).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
  };

  /**
   * Reinicia el formulario, errores y estado de 'tocado'.
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
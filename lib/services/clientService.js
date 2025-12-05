/**
* clientService.js
* Servicio simple para almacenar datos del cliente en el frontend
* Compatible con microservicio de usuarios
  */

// Llaves para localStorage
const CLIENT_ID_KEY = "clienteId";
const CLIENT_EMAIL_KEY = "clienteCorreo";

/**

* Guarda el ID del cliente en localStorage
* @param {string|number} id
  */
  export function setClienteId(id) {
  if (typeof window !== "undefined") {
  localStorage.setItem(CLIENT_ID_KEY, id);
  }
  }

/**

* Obtiene el ID del cliente desde localStorage
* @returns {string|null}
  */
  export function getClienteId() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CLIENT_ID_KEY);
  }

/**

* Guarda el correo del cliente en localStorage
* @param {string} correo
  */
  export function setClienteCorreo(correo) {
  if (typeof window !== "undefined") {
  localStorage.setItem(CLIENT_EMAIL_KEY, correo);
  }
  }

/**

* Obtiene el correo del cliente desde localStorage
* @returns {string|null}
  */
  export function getClienteCorreo() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CLIENT_EMAIL_KEY);
  }

/**

* Limpia los datos del cliente del localStorage
  */
  export function clearClienteData() {
  if (typeof window !== "undefined") {
  localStorage.removeItem(CLIENT_ID_KEY);
  localStorage.removeItem(CLIENT_EMAIL_KEY);
  }
  }

  // guarda en local el nombre del clinte
  const CLIENT_NOMBRE_KEY = "clienteNombre";

export function setClienteNombre(nombre) {
  if (typeof window !== "undefined") {
    localStorage.setItem(CLIENT_NOMBRE_KEY, nombre);
  }
}

export function getClienteNombre() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CLIENT_NOMBRE_KEY);
}

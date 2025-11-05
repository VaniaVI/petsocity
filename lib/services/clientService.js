// services/clientService.js

// Array que guarda todos los clientes
const clientes = [];

/**
 * Crear un nuevo cliente
 */
export const crearCliente = (clienteData) => {
  const nuevoCliente = { id: clientes.length + 1, ...clienteData };
  clientes.push(nuevoCliente);
  return nuevoCliente;
};

/**
 * Obtener cliente por correo
 */
export const obtenerClientePorCorreo = (correo) => {
  return clientes.find((c) => c.correo === correo) || null;
};

/**
 * Actualizar cliente existente
 */
export const actualizarCliente = (id, data) => {
  const index = clientes.findIndex((c) => c.id === Number(id));
  if (index === -1) return null;
  clientes[index] = { ...clientes[index], ...data };
  return clientes[index];
};

/**
 * Registrar cliente desde checkout
 * Si existe, actualiza; si no, crea
 */
export const registrarClienteCheckout = (clienteData) => {
  const clienteExistente = obtenerClientePorCorreo(clienteData.correo);

  if (clienteExistente) {
    return actualizarCliente(clienteExistente.id, clienteData);
  } else {
    return crearCliente(clienteData);
  }
};

/**
 * Opcional: obtener todos los clientes
 */
export const getClientes = () => clientes;

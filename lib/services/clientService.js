// lib/services/clientService.js
// ✅ Servicio modular y seguro para gestión de clientes

const CLIENT_KEY = "clientes_v1";

// ============================================
// HELPERS PRIVADOS
// ============================================

/**
 * Dispara un evento global cuando se modifican los clientes
 */
function notifyUpdate() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("clientsUpdated"));
  }
}

/**
 * Valida la estructura de un cliente
 */
function validateClient(client) {
  if (!client || typeof client !== "object") {
    throw new Error("Cliente inválido");
  }

  if (!client.nombre || !client.apellidos || !client.correo) {
    throw new Error("Cliente incompleto: nombre, apellidos y correo requeridos");
  }

  return {
    id: client.id || crypto.randomUUID(),
    nombre: String(client.nombre).trim(),
    apellidos: String(client.apellidos).trim(),
    correo: String(client.correo).trim().toLowerCase(),
    telefono: client.telefono || null,
    direccion: client.direccion || null,
    creadoEn: client.creadoEn || new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  };
}

// ============================================
// ALMACENAMIENTO LOCAL
// ============================================

export function getClients() {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(CLIENT_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error leyendo clientes:", error);
    return [];
  }
}

export function saveClients(clients) {
  if (typeof window === "undefined") return;

  try {
    const validated = Array.isArray(clients) ? clients : [];
    localStorage.setItem(CLIENT_KEY, JSON.stringify(validated));
    notifyUpdate();
  } catch (error) {
    console.error("Error guardando clientes:", error);
  }
}

// ============================================
// CRUD CLIENTES
// ============================================

export function crearCliente(clientData) {
  const client = validateClient(clientData);
  const clients = getClients();

  // Validar que no exista un cliente con ese correo
  if (clients.some(c => c.correo === client.correo)) {
    throw new Error("El correo ya está registrado");
  }

  clients.push(client);
  saveClients(clients);

  return client;
}

export function obtenerClientePorCorreo(correo) {
  const clients = getClients();
  return clients.find(c => c.correo === String(correo).toLowerCase()) || null;
}

export function obtenerClientePorId(id) {
  const clients = getClients();
  return clients.find(c => c.id === String(id)) || null;
}

export function actualizarCliente(id, data) {
  const clients = getClients();
  const index = clients.findIndex(c => c.id === String(id));
  if (index === -1) return null;

  const updated = {
    ...clients[index],
    ...data,
    actualizadoEn: new Date().toISOString(),
  };

  clients[index] = validateClient(updated);
  saveClients(clients);
  return clients[index];
}

export function eliminarCliente(id) {
  const clients = getClients();
  const filtered = clients.filter(c => c.id !== String(id));
  saveClients(filtered);
}

export function limpiarClientes() {
  saveClients([]);
}

// ============================================
// CONSTANTES
// ============================================

export const CLIENT_CONSTANTS = {
  STORAGE_KEY: CLIENT_KEY,
};

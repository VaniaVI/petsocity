// data/clientData.js
export let clientes = []; // <-- tu "base de datos" en memoria
let nextId = 1;

/**
 * Obtiene el siguiente ID disponible y lo incrementa.
 * Esto asegura que la modificación (nextId++) solo ocurre dentro de este módulo,
 * evitando el error "cannot reassign to an imported binding".
 */
export function getNewId() {
  const newId = nextId;
  nextId++;
  return newId;
}
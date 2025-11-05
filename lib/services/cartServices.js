// lib/services/cartService.js
// ✅ Servicio modular y seguro para gestión de carrito

const CART_KEY = "carrito_v2";
const MAX_PER_ITEM = 10;
const MIN_PER_ITEM = 1;
const ENVIO_GRATIS_MINIMO = 30000;
const COSTO_ENVIO_BASE = 3000;

// ============================================
// HELPERS PRIVADOS
// ============================================

/**
 * Notifica cambios en el carrito via eventos
 */
function notifyUpdate() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cartUpdated"));
  }
}

/**
 * Valida que un producto tenga la estructura mínima
 */
function validateProduct(product) {
  if (!product || typeof product !== "object") {
    throw new Error("Producto inválido");
  }

  const id = String(product.id || product.sku || product._id || "");
  if (!id) {
    throw new Error("Producto sin ID válido");
  }

  return {
    id,
    nombre: String(product.name || product.nombre || "Producto sin nombre"),
    precio: Number(product.price || product.precio || 0),
    img: product.img || null,
  };
}

/**
 * Valida y normaliza cantidad
 */
function validateQuantity(qty) {
  const num = Number(qty);
  if (isNaN(num) || num < MIN_PER_ITEM) return MIN_PER_ITEM;
  if (num > MAX_PER_ITEM) return MAX_PER_ITEM;
  return Math.floor(num);
}

// ============================================
// OPERACIONES DE ALMACENAMIENTO
// ============================================

/**
 * Obtiene el carrito desde localStorage
 * @returns {Array} Array de items del carrito
 */
export function getCart() {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(CART_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error leyendo carrito:", error);
    return [];
  }
}

/**
 * Guarda el carrito en localStorage
 * @param {Array} cart - Array de items
 */
export function saveCart(cart) {
  if (typeof window === "undefined") return;

  try {
    const validated = Array.isArray(cart) ? cart : [];
    localStorage.setItem(CART_KEY, JSON.stringify(validated));
    notifyUpdate();
  } catch (error) {
    console.error("Error guardando carrito:", error);
  }
}

// ============================================
// OPERACIONES CRUD
// ============================================

/**
 * Agrega un producto al carrito
 * @param {Object} product - Producto a agregar
 * @param {number} quantity - Cantidad (default: 1)
 */
export function addItem(product, quantity = 1) {
  try {
    const validated = validateProduct(product);
    const qty = validateQuantity(quantity);
    const cart = getCart();

    const existingIndex = cart.findIndex(item => item.id === validated.id);

    if (existingIndex >= 0) {
      // Producto ya existe: incrementar cantidad
      const newQty = cart[existingIndex].quantity + qty;
      cart[existingIndex].quantity = validateQuantity(newQty);
    } else {
      // Producto nuevo: agregar al carrito
      cart.push({
        ...validated,
        quantity: qty,
      });
    }

    saveCart(cart);
    return true;
  } catch (error) {
    console.error("Error agregando item:", error);
    return false;
  }
}

/**
 * Elimina un producto del carrito
 * @param {string} id - ID del producto
 */
export function removeItem(id) {
  const cart = getCart();
  const filtered = cart.filter(item => item.id !== String(id));
  saveCart(filtered);
}

/**
 * Actualiza la cantidad de un producto
 * @param {string} id - ID del producto
 * @param {number} quantity - Nueva cantidad
 */
export function updateQuantity(id, quantity) {
  const cart = getCart();
  const index = cart.findIndex(item => item.id === String(id));

  if (index >= 0) {
    cart[index].quantity = validateQuantity(quantity);
    saveCart(cart);
  }
}

/**
 * Incrementa la cantidad de un producto en 1
 */
export function incrementItem(id) {
  const cart = getCart();
  const index = cart.findIndex(item => item.id === String(id));

  if (index >= 0) {
    const newQty = cart[index].quantity + 1;
    cart[index].quantity = validateQuantity(newQty);
    saveCart(cart);
  }
}

/**
 * Decrementa la cantidad de un producto en 1
 */
export function decrementItem(id) {
  const cart = getCart();
  const index = cart.findIndex(item => item.id === String(id));

  if (index >= 0) {
    const newQty = cart[index].quantity - 1;
    if (newQty < MIN_PER_ITEM) {
      // Si llega a 0, eliminar el producto
      removeItem(id);
    } else {
      cart[index].quantity = newQty;
      saveCart(cart);
    }
  }
}

/**
 * Vacía el carrito completamente
 */
export function clearCart() {
  saveCart([]);
}

// ============================================
// CÁLCULOS Y TOTALES
// ============================================

/**
 * Calcula el subtotal del carrito
 * @param {Array} items - Items del carrito
 * @returns {number}
 */
function calculateSubtotal(items) {
  return items.reduce((sum, item) => {
    const precio = Number(item.precio) || 0;
    const quantity = Number(item.quantity) || 0;
    return sum + (precio * quantity);
  }, 0);
}

/**
 * Calcula el costo de envío según método y subtotal
 * @param {string} metodo - 'retiro' | 'domicilio'
 * @param {number} subtotal - Subtotal del carrito
 * @returns {number}
 */
export function calculateEnvio(metodo, subtotal) {
  if (metodo !== "domicilio") return 0;
  if (subtotal >= ENVIO_GRATIS_MINIMO) return 0;
  return COSTO_ENVIO_BASE;
}

/**
 * Obtiene todos los totales del carrito
 * @param {string} metodo - Método de entrega (opcional)
 * @returns {Object}
 */
export function getTotals(metodo = "retiro") {
  const items = getCart();
  const subtotal = calculateSubtotal(items);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const envio = calculateEnvio(metodo, subtotal);
  const total = subtotal + envio;

  return {
    items,
    subtotal,
    itemCount,
    envio,
    total,
  };
}

// ============================================
// CONSTANTES EXPORTADAS
// ============================================

export const CART_CONSTANTS = {
  MAX_PER_ITEM,
  MIN_PER_ITEM,
  ENVIO_GRATIS_MINIMO,
  COSTO_ENVIO_BASE,
};
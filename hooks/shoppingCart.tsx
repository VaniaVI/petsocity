'use cliente';

const KEY = "carrito";
const MAX = 10; // Este es el tope por producto

// Esta función lanza un evento global cada vez que el carrito cambia
// Así, otros componentes como el navbar se actualizan solos
const notify = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cartUpdated"));
  }
};

export function getCart() {
    try {
        return JSON.parse(localStorage.getItem(KEY) || "[]");
    }   catch {
        return[];
    }
}

export function setCart(arr) {
    localStorage.setItem(KEY, JSON.stringify(arr));
    notify(); // avisamos a toda la app que hubo cambios
}

// Agrega un producto nuevo o aumenta la cantidad si ya está en el carrito
export function addToCart(product, cant = 1) {
  const cart = getCart();
  const id = String(product.id ?? product._id ?? product.sku ?? product.nombre);
  const idx = cart.findIndex((x) => String(x.id) === id);

  if (idx >= 0) {
    cart[idx].quantity = Math.min(MAX, (cart[idx].quantity || 1) + cant);
  } else {
    cart.push({
      id,
      nombre: product.nombre || "Producto sin nombre",
      precio: Number(product.precio ?? 0),
      img: product.img || null,
      quantity: Math.min(MAX, Math.max(1, cant)),
    });
  }
  setCart(cart);
}

// Suma 1 unidad
export function incItem(id) {
  const cart = getCart();
  const i = cart.findIndex((x) => String(x.id) === String(id));
  if (i >= 0) {
    cart[i].quantity = Math.min(MAX, (cart[i].quantity || 1) + 1);
    setCart(cart);
  }
}

// Resta 1 unidad (sin bajar de 1)
export function decItem(id) {
  const cart = getCart();
  const i = cart.findIndex((x) => String(x.id) === String(id));
  if (i >= 0) {
    cart[i].quantity = Math.max(1, (cart[i].quantity || 1) - 1);
    setCart(cart);
  }
}

// Elimina el producto por completo
export function removeItem(id) {
  const cart = getCart().filter((x) => String(x.id) !== String(id));
  setCart(cart);
}

// Vacía todo el carrito
export function clearCart() {
  setCart([]);
}

// Calcula subtotales, envío y total final
export function totals(metodo = "retiro") {
  const items = getCart();
  const subtotal = items.reduce(
    (a, it) => a + (Number(it.precio) || 0) * (it.quantity || 1),
    0
  );
  const envio = metodo === "retiro" ? 0 : subtotal > 30000 ? 0 : 3990;
  const total = subtotal + envio;
  const totalItems = items.reduce((a, it) => a + (it.quantity || 0), 0);
  return { items, subtotal, envio, total, totalItems };
}
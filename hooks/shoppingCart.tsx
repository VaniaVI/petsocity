'use client';

const KEY = 'carrito';
const MAX = 10;

const notify = () => {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('cartUpdated'));
};

export function getCart() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}
export function setCart(arr: any[]) { localStorage.setItem(KEY, JSON.stringify(arr)); notify(); }

export function addToCart(product: any, cant: number = 1) {
  const cart = getCart();
  const id = String(product.id ?? product._id ?? product.sku ?? product.nombre);
  const i = cart.findIndex((x: any) => String(x.id) === id);
  if (i >= 0) {
    cart[i].quantity = Math.min(MAX, (cart[i].quantity || 1) + cant);
  } else {
    cart.push({
      id,
      nombre: product.nombre || 'Producto',
      precio: Number(product.precio || 0),
      img: product.img || null,
      quantity: Math.min(MAX, Math.max(1, cant)),
    });
  }
  setCart(cart);
}
export function incItem(id: string) { const c = getCart(); const i = c.findIndex((x:any)=>String(x.id)===String(id)); if(i>=0){ c[i].quantity=Math.min(MAX,(c[i].quantity||1)+1); setCart(c);} }
export function decItem(id: string) { const c = getCart(); const i = c.findIndex((x:any)=>String(x.id)===String(id)); if(i>=0){ c[i].quantity=Math.max(1,(c[i].quantity||1)-1); setCart(c);} }
export function removeItem(id: string) { setCart(getCart().filter((x:any)=>String(x.id)!==String(id))); }
export function clearCart() { setCart([]); }

export function totals(metodo: string = 'retiro') {
  const items = getCart();
  const subtotal = items.reduce((a:number,it:any)=>a + (Number(it.precio)||0)*(it.quantity||1), 0);
  const envio = metodo === 'retiro' ? 0 : (subtotal > 30000 ? 0 : 3990);
  const total = subtotal + envio;
  const totalItems = items.reduce((a:number,it:any)=>a+(it.quantity||0),0);
  return { items, subtotal, envio, total, totalItems };
}

//lib/services/orderService.js
const ORDER_KEY = "ordenes_v1";

export function getOrders() {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(ORDER_KEY);
  try {
    return stored ? JSON.parse(stored) : [];
  } catch {
    return []; // Si parse falla, devolvemos array vacío
  }
}

export function saveOrders(orders) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ORDER_KEY, JSON.stringify(orders));
}

export function crearOrden(orderData) {
  const orders = getOrders();
  const nuevaOrden = {
    id: crypto.randomUUID(),
    ...orderData,
    fecha: new Date().toISOString(),
    estado: "pendiente",
  };
  orders.push(nuevaOrden);
  saveOrders(orders);
  return nuevaOrden;
}

export function getOrderById(id) {
  const orders = getOrders();
  return orders.find(o => o.id === Number(id));
}
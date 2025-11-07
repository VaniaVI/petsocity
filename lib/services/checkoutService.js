// lib/services/checkoutService.js
import { getOrders, saveOrders } from "./orderService";
import { obtenerClientePorCorreo } from "./clientService";

export async function procesarCheckout(formData, carrito) {
  try {
    // 1️⃣ Validar datos mínimos
    if (!formData.nombre || !formData.correo) {
      throw new Error("Faltan campos obligatorios del cliente.");
    }

    // Validar dirección si es envío a domicilio
    if (formData.metodo === "domicilio") {
      if (!formData.calle || !formData.region || !formData.comuna) {
        throw new Error("Faltan datos obligatorios de la dirección de envío.");
      }
    }

    if (!carrito || carrito.length === 0) {
      throw new Error("El carrito está vacío.");
    }

    // 2️⃣ Obtener cliente registrado (si existe)
    const cliente = obtenerClientePorCorreo(formData.correo);

    // 3️⃣ Crear objeto de orden
    const nuevaOrden = {
      id: Date.now(), // o crypto.randomUUID()
      buyer: {
        nombre: cliente ? cliente.nombre : formData.nombre,
        apellidos: formData.apellidos || "",
        correo: formData.correo,
      },
      shipping: {
        metodo: formData.metodo,
        direccion: {
          calle: formData.calle || "",
          departamento: formData.departamento || "",
          region: formData.region || "",
          comuna: formData.comuna || "",
          indicaciones: formData.indicaciones || "",
        },
      },
      items: carrito.map(item => ({
        nombre: item.nombre,
        precio: item.precio,
        quantity: item.quantity,
      })),
      totales: {
        subtotal: carrito.reduce((acc, i) => acc + i.precio * i.quantity, 0),
        envio: formData.metodo === "domicilio" ? 3000 : 0, // ejemplo
        total:
          carrito.reduce((acc, i) => acc + i.precio * i.quantity, 0) +
          (formData.metodo === "domicilio" ? 3000 : 0),
      },
      fecha: new Date().toISOString(),
      estado: "Pendiente",
    };

    // 4️⃣ Guardar la orden en localStorage
    const ordenesActuales = getOrders();
    ordenesActuales.push(nuevaOrden);
    saveOrders(ordenesActuales);

    // Guardar la última orden también
    localStorage.setItem("ultimaOrden", JSON.stringify(nuevaOrden));

    // 5️⃣ Devolver orden completa
    return {
      exito: true,
      mensaje: "Orden creada exitosamente",
      orden: nuevaOrden,
    };
  } catch (error) {
    console.error("❌ Error al procesar checkout:", error.message);
    return {
      exito: false,
      mensaje: error.message,
    };
  }
}

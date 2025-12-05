// lib/services/checkoutService.js
export async function procesarCheckout(formData, carrito) {
  try {
    if (!formData.nombre || !formData.correo) {
      throw new Error("Faltan campos obligatorios del cliente.");
    }

    if (formData.metodo === "domicilio") {
      if (!formData.calle || !formData.region || !formData.comuna) {
        throw new Error("Faltan datos obligatorios de la dirección de envío.");
      }
    }

    if (!carrito || carrito.length === 0) {
      throw new Error("El carrito está vacío.");
    }

    // Construir payload para API
    const payload = {
      userId: null, // más adelante lo conectamos con login real
      customerData: {
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        correo: formData.correo,
        direccion: {
          calle: formData.calle || "",
          departamento: formData.departamento || "",
          region: formData.region || "",
          comuna: formData.comuna || "",
          indicaciones: formData.indicaciones || "",
        },
      },
      deliveryMethod: formData.metodo,
      cartItems: carrito.map((item) => ({
        id: item.id,
        nombre: item.nombre,
        precio: item.precio,
        cantidad: item.quantity,
      })),
      totals: {
        subtotal: carrito.reduce((acc, i) => acc + i.precio * i.quantity, 0),
        envio: formData.metodo === "domicilio" ? 3000 : 0,
        total:
          carrito.reduce((acc, i) => acc + i.precio * i.quantity, 0) +
          (formData.metodo === "domicilio" ? 3000 : 0),
      },
    };

    // Llamar API
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Error al crear la orden.");
    }

    // ✅ Devolver en el formato que tu checkout espera
    return {
      exito: true,
      mensaje: "Orden creada exitosamente",
      orden: {
        id: data.orderId,
        orderNumber: data.orderNumber,
        orderCode: data.orderCode,
      },
    };
  } catch (error) {
    console.error("Error en checkout:", error.message);
    return {
      exito: false,
      mensaje: error.message,
    };
  }
}

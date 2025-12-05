// lib/services/checkoutService.js

export async function procesarCheckout(formData, carrito) {
  try {
    // Validaciones mínimas
    if (!formData.nombre || !formData.correo) {
      throw new Error("Faltan campos obligatorios del cliente.");
    }

    if (!carrito || carrito.length === 0) {
      throw new Error("El carrito está vacío.");
    }

    // Construir payload para el microservicio
    const orderData = {
      customerData: JSON.stringify({
        nombre: formData.nombre,
        apellido: formData.apellido,
        correo: formData.correo,
        calle: formData.calle,
        departamento: formData.departamento,
        region: formData.region,
        comuna: formData.comuna,
        indicaciones: formData.indicaciones
      }),
      cartItems: JSON.stringify(
        carrito.map(item => ({
          id: item.id,
          nombre: item.nombre,
          precio: item.precio,
          quantity: item.quantity
        }))
      ),
      totals: JSON.stringify({
        subtotal: carrito.reduce((acc, i) => acc + i.precio * i.quantity, 0),
        envio: formData.metodo === "domicilio" ? 3000 : 0,
        total:
          carrito.reduce((acc, i) => acc + i.precio * i.quantity, 0) +
          (formData.metodo === "domicilio" ? 3000 : 0)
      }),
      deliveryMethod: formData.metodo
    };

    // Llamar al microservicio en Railway
    const res = await fetch(
      "https://ordenes-production-ac23.up.railway.app/api/v1/orders",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
        
      }
    );

    if (!res.ok) {
      throw new Error("Error al crear la orden en el servidor.");
    }

    const ordenCreada = await res.json();

    // Devolver orden real del microservicio
    return {
      exito: true,
      mensaje: "Orden creada exitosamente",
      orden: ordenCreada
    };

  } catch (error) {
    console.error("❌ Error al procesar checkout:", error.message);
    console.log("✅ Orden creada:", ordenCreada);
    return {
      exito: false,
      mensaje: error.message
    };
  }
  
}

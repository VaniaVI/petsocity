// lib/services/checkoutService.js

export async function procesarCheckout(formData, carrito) {
  let ordenCreada = null; 

  try {
    if (!formData.nombre || !formData.correo) {
      throw new Error("Faltan campos obligatorios del cliente.");
    }

    if (!carrito || carrito.length === 0) {
      throw new Error("El carrito está vacío.");
    }

    const subtotal = carrito.reduce((acc, i) => acc + i.precio * i.quantity, 0);
    const envio = formData.metodo === "domicilio" ? 3000 : 0;

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
        subtotal,
        envio,
        total: subtotal + envio
      }),
      deliveryMethod: formData.metodo
    };

    console.log("📦 Payload enviado a órdenes:", orderData);

    const res = await fetch(
      "https://ordenes-production-ac23.up.railway.app/api/v1/orders",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("🔥 Error backend órdenes:", errorText);
      throw new Error("Error al crear la orden en el servidor.");
    }

    ordenCreada = await res.json();
    console.log("✅ Orden creada correctamente:", ordenCreada);

    if (!ordenCreada.paymentUrl) {
      throw new Error("No se recibió la URL de pago");
    }
    
    window.location.href = ordenCreada.paymentUrl;

    return {
      exito: true,
      mensaje: "Orden creada exitosamente",
      orden: ordenCreada
    };

  } catch (error) {
    console.error("❌ Error en checkout:", error);
    return {
      exito: false,
      mensaje: error.message
    };
  }
}

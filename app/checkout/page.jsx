"use client";
import { useEffect, useState } from "react";
import { totals, clearCart } from "@/hooks/shoppingCart";
import Link from "next/link";

export default function CheckoutPage() {
  const [metodo, setMetodo] = useState("domicilio"); // o "retiro"
  const [data, setData] = useState({ items: [], subtotal: 0, envio: 0, total: 0 });
  const [ready, setReady] = useState(false);
  const [alertKind, setAlertKind] = useState("secondary");

  // cargar totales solo para el cliente
  useEffect(() => {
    const t = totals(metodo);        // LocalStorage
    setData(t);
    setAlertKind(t.subtotal > 30000 || metodo === "retiro" ? "secondary" : "warning");
    setReady(true);
  }, [metodo]);

  if (!ready) {
    return <main className="container py-4"><h1>Checkout</h1><p className="text-muted">Cargando resumen…</p></main>;
  }

  const onConfirm = async () => {
    if (!data.items.length) return alert("Tu carrito está vacío.");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: data.items, buyer: { nombre: "Cliente", email: "cliente@demo.cl" } }),
      });
      if (!res.ok) throw new Error("No se pudo confirmar");
      // limpiar y redirigir
      clearCart();
      window.location.href = "/compraExitosa";
    } catch {
      alert("Hubo un problema confirmando la compra.");
    }
  };

  return (
    <main className="container py-4">
      <h1>Checkout</h1>

      <div className={`alert alert-${alertKind} d-flex justify-content-between`}>
        <span>
          {metodo === "domicilio"
            ? (data.subtotal > 30000 ? "Envío gratis por compras sobre $30.000." : "Costo de envío $3.990.")
            : "Retiro en tienda sin costo de envío."}
        </span>
        <select
          className="form-select w-auto"
          value={metodo}
          onChange={(e) => setMetodo(e.target.value)}
        >
          <option value="domicilio">Despacho a domicilio</option>
          <option value="retiro">Retiro en tienda</option>
        </select>
      </div>

      <div className="card p-3">
        <div className="d-flex justify-content-between"><span>Subtotal</span><strong>${data.subtotal.toLocaleString("es-CL")}</strong></div>
        <div className="d-flex justify-content-between"><span>Envío</span><strong>${data.envio.toLocaleString("es-CL")}</strong></div>
        <hr />
        <div className="d-flex justify-content-between"><span>Total</span><strong>${data.total.toLocaleString("es-CL")}</strong></div>
      </div>

      <div className="d-flex gap-2 mt-3">
        <button className="btn btn-success" onClick={onConfirm}>Confirmar compra</button>
        <Link href="/carrito" className="btn btn-outline-secondary">Volver al carrito</Link>
      </div>
    </main>
  );
}
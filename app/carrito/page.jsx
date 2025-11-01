"use client";

import { useEffect, useState } from "react";
import { decItem, incItem, removeItem, clearCart, totals } from "../../hooks/shoppingCart";

export default function CarritoPage() {
  const [items, setItems] = useState([]);
  const [metodo, setMetodo] = useState("retiro");
  const [sub, setSub] = useState(0);
  const [env, setEnv] = useState(0);
  const [tot, setTot] = useState(0);

  // Funcion que recalcula los datos del carrito
  const refresh = () => {
    const { items, subtotal, envio, total } = totals(metodo);
    setItems(items);
    setSub(subtotal);
    setEnv(envio);
    setTot(total);
  };

  // Carga los datos iniciales y actualizar al detectar cambios
  useEffect(() => {
    refresh();
    const handleUpdate = () => refresh();
    window.addEventListener("cartUpdated", handleUpdate);
    return () => window.removeEventListener("cartUpdated", handleUpdate);
  }, []);

  // Recalcula al cambiar el metodo de envio
  useEffect(() => {
    refresh();
  }, [metodo]);

  // Si el carrito esta vacio, mostramos un mensaje
  if (!items.length) {
    return (
      <main className="container py-4">
        <h1 className="mb-3">Tu Carrito</h1>
        <div className="alert alert-info">
          Aún no has agregado productos
        </div>
      </main>
    );
  }

  // Tabla principal del carrito
  return (
    <main className="container py-4">
      <h1 className="mb-4">Carrito de Compras</h1>

      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id}>
                <td className="d-flex align-items-center gap-2">
                  {it.img && (
                    <img
                      src={it.img}
                      alt={it.nombre}
                      width={60}
                      height={60}
                      className="rounded"
                    />
                  )}
                  <span>{it.nombre}</span>
                </td>
                <td>$ {Number(it.precio).toLocaleString("es-CL")}</td>
                <td>
                  <div className="btn-group">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => decItem(it.id)}
                    >
                      −
                    </button>
                    <button className="btn btn-sm btn-light disabled">
                      {it.quantity}
                    </button>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => incItem(it.id)}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td>
                  $ {(Number(it.precio) * Number(it.quantity)).toLocaleString("es-CL")}
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeItem(it.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="row g-4 mt-3">
        <div className="col-md-6">
          <label className="form-label fw-semibold">Método de envío</label>
          <select
            className="form-select"
            value={metodo}
            onChange={(e) => setMetodo(e.target.value)}
          >
            <option value="retiro">Retiro en tienda (sin costo)</option>
            <option value="domicilio">
              Despacho a domicilio {env ? `(+ $${env.toLocaleString("es-CL")})` : "(gratis)"}
            </option>
          </select>
        </div>

        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body d-flex flex-column gap-2">
              <div className="d-flex justify-content-between">
                <span>Subtotal</span>
                <strong>$ {sub.toLocaleString("es-CL")}</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span>Envío</span>
                <strong>$ {env.toLocaleString("es-CL")}</strong>
              </div>
              <hr />
              <div className="d-flex justify-content-between fs-5">
                <span>Total</span>
                <strong>$ {tot.toLocaleString("es-CL")}</strong>
              </div>
              <button
                className="btn btn-success mt-3"
                onClick={() => console.log("Procesar pago o continuar flujo de compra")}
              >
                Confirmar compra
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={() => clearCart()}
              >
                Vaciar carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

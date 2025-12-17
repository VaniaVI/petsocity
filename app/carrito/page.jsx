'use client';
// app/carrito/page.jsx

import { useCart } from "@/hooks/useCart";
import { fmtCLP } from "@/lib/formatters";
import { Balloon, Trash, Truck } from "react-bootstrap-icons";

export default function CartPage() {
  const { metodo , setMetodo , items , subtotal , envio , total , incItem , decItem , removeItem , clearCart , constants
  } = useCart("retiro");

  // ============================================
  // RENDERIZADO CONDICIONAL: CARRITO VACÍz
  // ============================================
  if (!items || items.length === 0) {
    return (
      <main className="container min-vh-100 py-5">
        <div className="text-center">
          <h1 className="mb-4">Tu Carrito</h1>
          <div className="alert alert-info mx-auto" style={{ maxWidth: "500px" }}>
            <p className="mb-2">Tu carrito está vacío</p>
            <p className="mb-0 small text-muted">
              Explora nuestros productos y agrega lo que más te guste
            </p>
          </div>
          <a href="/products" className="btn btn-primary mt-3">
            Ver productos
          </a>
        </div>
      </main>
    );
  }

  // ============================================
  // RENDERIZADO: CARRITO CON PRODUCTOS
  // ============================================
  return (
    <main className="container py-4">
      <h1 className="mb-4">Carrito de Compras</h1>

      {/* Banner de envío gratis */}
      {metodo === "domicilio" && envio === 0 && subtotal >= constants.ENVIO_GRATIS_MINIMO && (
        <div className="alert alert-success mb-4">
          ¡Envío gratis! Tu compra supera los {fmtCLP(constants.ENVIO_GRATIS_MINIMO)}
        </div>
      )}

      {/* Tabla de productos */}
      <div className="table-responsive mb-4">
        <table className="table align-middle">
          <thead className="table-light">
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th className="text-center">Cantidad</th>
              <th className="text-end">Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                {/* Columna: Producto */}
                <td>
                  <div className="d-flex align-items-center gap-3">
                    {item.img && (
                      <img
                        src={item.img}
                        alt={item.nombre}
                        width={60}
                        height={60}
                        className="rounded object-fit-cover"
                        style={{ minWidth: "60px" }}
                      />
                    )}
                    <span className="fw-medium">{item.nombre}</span>
                  </div>
                </td>

                {/* Columna: Precio unitario */}
                <td className="text-nowrap">{fmtCLP(item.precio)}</td>

                {/* Columna: Controles de cantidad */}
                <td>
                  <div className="btn-group d-flex justify-content-center" role="group">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => decItem(item.id)}
                      aria-label="Disminuir cantidad"
                    >
                      −
                    </button>
                    <button
                      className="btn btn-sm btn-light disabled"
                      style={{ minWidth: "50px" }}
                    >
                      {item.quantity}
                    </button>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => incItem(item.id)}
                      disabled={item.quantity >= constants.MAX_PER_ITEM}
                      aria-label="Aumentar cantidad"
                    >
                      +
                    </button>
                  </div>
                </td>

                {/* Columna: Subtotal */}
                <td className="text-end fw-semibold text-nowrap">
                  {fmtCLP(item.precio * item.quantity)}
                </td>

                {/* Columna: Eliminar */}
                <td className="text-end">
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeItem(item.id)}
                    aria-label="Eliminar producto"
                  >
                    <Trash width={15}></Trash>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sección inferior: Método de entrega y resumen */}
      <div className="row g-4">
        {/* Columna: Método de entrega */}
        <div className="col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">📦 Método de entrega</h5>
              <select
                className="form-select"
                value={metodo}
                onChange={(e) => setMetodo(e.target.value)}
              >
                <option value="retiro">
                  Retiro en tienda (sin costo)
                </option>
                <option value="domicilio">
                  Despacho a domicilio
                  {subtotal >= constants.ENVIO_GRATIS_MINIMO
                    ? " (gratis)"
                    : ` (+${fmtCLP(constants.COSTO_ENVIO_BASE)}) — Gratis sobre ${fmtCLP(constants.ENVIO_GRATIS_MINIMO)}`}
                </option>
              </select>

              {/* Info adicional según método */}
              <div className="mt-3 small text-muted">
                {metodo === "retiro" ? (
                  <p className="mb-0  d-flex gap-2 justify-contents-start">
                   <Balloon/> Puedes retirar tu pedido en nuestra tienda ubicada en Providencia
                  </p>
                ) : (
                  <p className="mb-0 d-flex gap-2 justify-contents-start">
                    <Truck/> Envío estimado: 2-5 días hábiles
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Columna: Resumen del pedido */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 bg-light">
            <div className="card-body">
              <h5 className="card-title mb-3">Resumen del pedido</h5>

              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal ({items.length} producto{items.length !== 1 ? "s" : ""})</span>
                <strong>{fmtCLP(subtotal)}</strong>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span>Envío</span>
                <strong>{envio === 0 ? "Gratis" : fmtCLP(envio)}</strong>
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-4 fs-5">
                <span className="fw-bold">Total</span>
                <strong className="text-primary">{fmtCLP(total)}</strong>
              </div>

              {/* Botones de acción */}
              <div className="d-grid gap-2">
                <a
                  href="/checkout"
                  className="btn btn-success btn-lg"
                >
                  Proceder al pago
                </a>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    if (confirm("¿Estás seguro de vaciar el carrito?")) {
                      clearCart();
                    }
                  }}
                >
                  Vaciar carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
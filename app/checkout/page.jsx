app/checkout
"use client";
import { useEffect, useState } from "react";
import { Container, Row, Col, Table, Form, Button, Card } from "react-bootstrap";
import { useCart } from "@/hooks/useCart";
import { fmtCLP } from "@/lib/formatters";

export default function CheckoutPage() {
  const {
    items,
    subtotal,
    envio,
    total,
    metodo,
    setMetodo,
    clearCart,
    constants,
  } = useCart("domicilio");

  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    correo: "",
    calle: "",
    departamento: "",
    region: "Región Metropolitana de Santiago",
    comuna: "Cerrillos",
    indicaciones: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!items || items.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    if (!formData.nombre || !formData.apellidos || !formData.correo) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }

    if (metodo === "domicilio" && !formData.calle) {
      alert("Por favor ingresa la dirección de entrega.");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        items: items.map((item) => ({
          id: item.id,
          nombre: item.nombre,
          precio: item.precio,
          quantity: item.quantity,
        })),
        buyer: {
          nombre: formData.nombre,
          apellidos: formData.apellidos,
          correo: formData.correo,
        },
        shipping: {
          metodo,
          direccion: metodo === "domicilio" ? {
            calle: formData.calle,
            departamento: formData.departamento,
            region: formData.region,
            comuna: formData.comuna,
            indicaciones: formData.indicaciones,
          } : null,
        },
        totales: {
          subtotal,
          envio,
          total,
        },
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) throw new Error("No se pudo confirmar la orden");

      const result = await res.json();

      // Limpiar carrito y redirigir
      clearCart();
      window.location.href = `/compraExitosa?orderId=${result.orderId || ""}`;
    } catch (error) {
      console.error(error);
      alert("Hubo un problema confirmando la compra. Por favor intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Si el carrito está vacío
  if (!items || items.length === 0) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <h1 className="mb-4">Carrito de compra</h1>
          <div className="alert alert-info mx-auto" style={{ maxWidth: "500px" }}>
            Tu carrito está vacío
          </div>
          <a href="/productos" className="btn btn-primary mt-3">
            Ver productos
          </a>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row>
        {/* Columna izquierda: Formulario */}
        <Col lg={8}>
          <h2 className="h4 mb-3">Carrito de compra</h2>
          <p className="text-muted small mb-4">Completa la siguiente información</p>

          {/* Tabla de productos */}
          <div className="table-responsive mb-4">
            <Table hover className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th className="text-center">Cantidad</th>
                  <th className="text-end">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td style={{ width: "80px" }}>
                      {item.img ? (
                        <img
                          src={item.img}
                          alt={item.nombre}
                          className="img-fluid rounded"
                          style={{ width: "60px", height: "60px", objectFit: "cover" }}
                        />
                      ) : (
                        <div
                          className="bg-secondary rounded"
                          style={{ width: "60px", height: "60px" }}
                        />
                      )}
                    </td>
                    <td>{item.nombre}</td>
                    <td>{fmtCLP(item.precio)}</td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-end fw-semibold">
                      {fmtCLP(item.precio * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {/* Formulario de información del cliente */}
          <Form onSubmit={handleSubmit}>
            <h5 className="mb-3">Información del cliente</h5>
            <p className="text-muted small mb-3">Completa la siguiente información</p>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Nombre*</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Apellidos*</Form.Label>
                  <Form.Control
                    type="text"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4">
              <Form.Label>Correo*</Form.Label>
              <Form.Control
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            {/* Dirección de entrega */}
            <h5 className="mb-3">Dirección de entrega de los productos</h5>
            <p className="text-muted small mb-3">Ingrese dirección de forma detallada</p>

            <Row className="mb-3">
              <Col md={8}>
                <Form.Group>
                  <Form.Label>Calle*</Form.Label>
                  <Form.Control
                    type="text"
                    name="calle"
                    value={formData.calle}
                    onChange={handleInputChange}
                    required={metodo === "domicilio"}
                    disabled={metodo === "retiro"}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Departamento (opcional)</Form.Label>
                  <Form.Control
                    type="text"
                    name="departamento"
                    placeholder="Ej: 603"
                    value={formData.departamento}
                    onChange={handleInputChange}
                    disabled={metodo === "retiro"}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Región*</Form.Label>
                  <Form.Select
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    disabled={metodo === "retiro"}
                  >
                    <option>Región Metropolitana de Santiago</option>
                    <option>Región de Valparaíso</option>
                    <option>Región del Biobío</option>
                    <option>Región de la Araucanía</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Comuna*</Form.Label>
                  <Form.Select
                    name="comuna"
                    value={formData.comuna}
                    onChange={handleInputChange}
                    disabled={metodo === "retiro"}
                  >
                    <option>Cerrillos</option>
                    <option>Santiago</option>
                    <option>Providencia</option>
                    <option>Las Condes</option>
                    <option>Maipú</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4">
              <Form.Label>Indicaciones para la entrega (opcional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="indicaciones"
                placeholder="Ej: Entre calles, color del edificio, no tiene timbre."
                value={formData.indicaciones}
                onChange={handleInputChange}
                disabled={metodo === "retiro"}
              />
            </Form.Group>

            <div className="d-grid">
              <Button
                variant="success"
                size="lg"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Procesando..." : `Pagar ahora ${fmtCLP(total)}`}
              </Button>
            </div>
          </Form>
        </Col>

        {/* Columna derecha: Resumen */}
        <Col lg={4}>
          <Card className="sticky-top" style={{ top: "20px" }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Total a pagar:</h5>
                <h4 className="text-primary mb-0">{fmtCLP(total)}</h4>
              </div>

              <hr />

              {/* Método de entrega */}
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold small">Método de entrega</Form.Label>
                <Form.Select
                  value={metodo}
                  onChange={(e) => setMetodo(e.target.value)}
                  size="sm"
                >
                  <option value="domicilio">
                    Despacho a domicilio
                    {subtotal >= constants.ENVIO_GRATIS_MINIMO
                      ? " (gratis)"
                      : ` (+${fmtCLP(constants.COSTO_ENVIO_BASE)})`}
                  </option>
                  <option value="retiro">Retiro en tienda (sin costo)</option>
                </Form.Select>
              </Form.Group>

              {/* Desglose de totales */}
              <div className="small">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Subtotal</span>
                  <span>{fmtCLP(subtotal)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Envío</span>
                  <span>{envio === 0 ? "Gratis" : fmtCLP(envio)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <strong>Total</strong>
                  <strong className="text-primary">{fmtCLP(total)}</strong>
                </div>
              </div>

              {/* Mensaje de envío gratis */}
              {metodo === "domicilio" && envio === 0 && subtotal >= constants.ENVIO_GRATIS_MINIMO && (
                <div className="alert alert-success mt-3 py-2 px-3 small mb-0">
                  🎉 ¡Envío gratis aplicado!
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
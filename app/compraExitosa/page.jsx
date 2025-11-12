"use client";
import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Container, Row, Col, Card, Table, Button, Spinner } from "react-bootstrap";
import { fmtCLP } from "@/lib/formatters";
import { getOrderById } from "@/lib/services/orderService";
import { HeaderCompra } from "@/components/HeaderCompra";

/* 
  ✅ Envolvemos el contenido en un componente separado
  para poder usar <Suspense> correctamente sin error
*/
function CompraExitosaContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [orderData, setOrderData] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    correo: "",
    calle: "",
    departamento: "",
    region: "",
    comuna: "",
    indicaciones: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) {
      setError("No se encontró el ID de la orden");
      setLoading(false);
      return;
    }

    // Obtener la orden desde el servicio o localStorage
    const orden = getOrderById(orderId) || JSON.parse(localStorage.getItem("ultimaOrden"));

    if (!orden) {
      setError("No se pudo cargar la información de tu compra");
      setLoading(false);
      return;
    }

    setOrderData(orden);

    // Rellenar campos con datos de checkout almacenados en localStorage
    const checkoutData = JSON.parse(localStorage.getItem("checkoutData"));
    setFormData({
      nombre: checkoutData?.nombre || orden.nombre || "",
      apellidos: checkoutData?.apellidos || orden.apellidos || "",
      correo: checkoutData?.correo || orden.correo || "",
      calle: checkoutData?.calle || orden.direccion?.calle || "",
      departamento: checkoutData?.departamento || orden.direccion?.departamento || "",
      region: checkoutData?.region || orden.direccion?.region || "",
      comuna: checkoutData?.comuna || orden.direccion?.comuna || "",
      indicaciones: checkoutData?.indicaciones || orden.direccion?.indicaciones || "",
    });

    setLoading(false);
  }, [orderId]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando información de tu compra...</p>
      </Container>
    );
  }

  if (error || !orderData) {
    return (
      <Container className="py-5">
        <Card className="text-center border-danger">
          <Card.Body>
            <h3 className="text-danger mb-3">Error</h3>
            <p>{error || "No se encontró la orden"}</p>
            <Button variant="primary" href="/products">Volver a productos</Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={10}>
          <HeaderCompra exito={!!orderData && !error} orderId={orderId} />

          <Row>
            {/* Información del cliente */}
            <Col md={6} className="mb-4">
              <Card>
                <Card.Header className="bg-light">
                  <h5 className="mb-0">Información del cliente</h5>
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <label className="text-muted small">Nombre*</label>
                    <input type="text" className="form-control" value={formData.nombre} readOnly />
                  </div>
                  <div className="mb-3">
                    <label className="text-muted small">Apellidos*</label>
                    <input type="text" className="form-control" value={formData.apellidos} readOnly />
                  </div>
                  <div>
                    <label className="text-muted small">Correo*</label>
                    <input type="email" className="form-control" value={formData.correo} readOnly />
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Dirección de entrega */}
            <Col md={6} className="mb-4">
              <Card>
                <Card.Header className="bg-light">
                  <h5 className="mb-0">Dirección de entrega</h5>
                </Card.Header>
                <Card.Body>
                  {orderData.metodo === "domicilio" ? (
                    <>
                      <div className="mb-3">
                        <label className="text-muted small">Calle*</label>
                        <input type="text" className="form-control" value={formData.calle} readOnly />
                      </div>
                      <div className="mb-3">
                        <label className="text-muted small">Departamento (opcional)</label>
                        <input type="text" className="form-control" value={formData.departamento} readOnly />
                      </div>
                      <div className="mb-3">
                        <label className="text-muted small">Región*</label>
                        <select className="form-select" disabled>
                          <option>{formData.region}</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="text-muted small">Comuna*</label>
                        <select className="form-select" disabled>
                          <option>{formData.comuna}</option>
                        </select>
                      </div>
                      {formData.indicaciones && (
                        <div>
                          <label className="text-muted small">Indicaciones (opcional)</label>
                          <textarea className="form-control" rows={3} value={formData.indicaciones} readOnly />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="alert alert-info">
                      <strong>Retiro en tienda</strong>
                      <p className="mb-0 mt-2 small">Puedes retirar tu pedido en nuestras tiendas.</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Tabla de productos */}
          <Card className="mb-4">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Detalle de productos</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table className="mb-0">
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
                    {orderData.items.map((item, index) => (
                      <tr key={index}>
                        <td className="d-flex gap-3 flex-grow-1">
                          {item.imagen && (
                            <img
                              src={item.imagen}
                              alt={item.nombre}
                              style={{
                                width: "60px",
                                height: "60px",
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                            />
                          )}
                        </td>
                        <td>{item.nombre}</td>
                        <td>{fmtCLP(item.precio)}</td>
                        <td className="text-center">{item.quantity}</td>
                        <td className="text-end">{fmtCLP(item.precio * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>

          {/* Totales */}
          <Card className="mb-4">
            <Card.Body>
              <div className="d-flex justify-content-end">
                <div style={{ minWidth: "300px" }}>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Subtotal:</span>
                    <span>{fmtCLP(orderData.totales.subtotal)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Envío:</span>
                    <span>{orderData.totales.envio === 0 ? "Gratis" : fmtCLP(orderData.totales.envio)}</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between">
                    <strong>Total pagado:</strong>
                    <strong className="text-success fs-4">{fmtCLP(orderData.totales.total)}</strong>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Botones de acción */}
          <div className="d-flex gap-2 justify-content-center mb-4">
            <Button variant="danger" onClick={() => window.print()}>
              Imprimir boleta en PDF
            </Button>
            <Button variant="success" onClick={() => alert("Boleta enviada al correo: " + formData.correo)}>
              Enviar boleta por email
            </Button>
          </div>

          {/* Botón volver */}
          <div className="text-center">
            <Button variant="primary" href="/products" size="lg">
              Volver a productos
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

/* 

  Aquí usamos <Suspense> para envolver el contenido.
*/
export default function CompraExitosaPage() {
  return (
    <Suspense fallback={
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando información de tu compra...</p>
      </Container>
    }>
      <CompraExitosaContent />
    </Suspense>
  );
}

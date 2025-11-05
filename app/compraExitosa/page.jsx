"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Container, Row, Col, Card, Table, Button, Spinner } from "react-bootstrap";
import { CheckCircleFill } from "react-bootstrap-icons";
import { fmtCLP } from "@/lib/formatters";

export default function CompraExitosaPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) {
      setError("No se encontró el ID de la orden");
      setLoading(false);
      return;
    }

    // Obtener datos de la orden
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        
        if (!res.ok) {
          throw new Error("No se pudo obtener la información de la orden");
        }

        const data = await res.json();
        setOrderData(data);
      } catch (err) {
        console.error("Error al obtener orden:", err);
        setError("No se pudo cargar la información de tu compra");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // Loading state
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando información de tu compra...</p>
      </Container>
    );
  }

  // Error state
  if (error || !orderData) {
    return (
      <Container className="py-5">
        <Card className="text-center border-danger">
          <Card.Body>
            <h3 className="text-danger mb-3">Error</h3>
            <p>{error || "No se encontró la orden"}</p>
            <Button variant="primary" href="/products">
              Volver a productos
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  // Success state
  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={10}>
          {/* Header de éxito */}
          <Card className="border-success mb-4">
            <Card.Body className="text-center py-5">
              <CheckCircleFill className="text-success mb-3" size={60} />
              <h1 className="mb-2">Se ha realizado la compra. nro #{orderId}</h1>
              <p className="text-muted mb-0">
                Código orden: <strong>ORDER{orderId}</strong>
              </p>
              <p className="text-muted small">
                Completa la siguiente información
              </p>
            </Card.Body>
          </Card>

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
                    <input 
                      type="text" 
                      className="form-control" 
                      value={orderData.buyer.nombre}
                      readOnly
                    />
                  </div>
                  <div className="mb-3">
                    <label className="text-muted small">Apellidos*</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={orderData.buyer.apellidos}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="text-muted small">Correo*</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      value={orderData.buyer.correo}
                      readOnly
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Dirección de entrega */}
            <Col md={6} className="mb-4">
              <Card>
                <Card.Header className="bg-light">
                  <h5 className="mb-0">Dirección de entrega de los productos</h5>
                </Card.Header>
                <Card.Body>
                  {orderData.shipping.metodo === "domicilio" ? (
                    <>
                      <div className="mb-3">
                        <label className="text-muted small">Calle*</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={orderData.shipping.direccion.calle}
                          readOnly
                        />
                      </div>
                      <Row className="mb-3">
                        <Col md={8}>
                          <label className="text-muted small">Departamento (opcional)</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            value={orderData.shipping.direccion.departamento || ""}
                            readOnly
                          />
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Col md={6}>
                          <label className="text-muted small">Región*</label>
                          <select className="form-select" disabled>
                            <option>{orderData.shipping.direccion.region}</option>
                          </select>
                        </Col>
                        <Col md={6}>
                          <label className="text-muted small">Comuna*</label>
                          <select className="form-select" disabled>
                            <option>{orderData.shipping.direccion.comuna}</option>
                          </select>
                        </Col>
                      </Row>
                      {orderData.shipping.direccion.indicaciones && (
                        <div>
                          <label className="text-muted small">Indicaciones para la entrega (opcional)</label>
                          <textarea 
                            className="form-control" 
                            rows={3}
                            value={orderData.shipping.direccion.indicaciones}
                            readOnly
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="alert alert-info">
                      <strong>Retiro en tienda</strong>
                      <p className="mb-0 mt-2 small">
                        Puedes retirar tu pedido en nuestras tiendas.
                      </p>
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
                        <td style={{ width: "80px" }}>
                          <div 
                            className="bg-secondary rounded"
                            style={{ width: "60px", height: "60px" }}
                          />
                        </td>
                        <td>{item.nombre}</td>
                        <td>{fmtCLP(item.precio)}</td>
                        <td className="text-center">{item.quantity}</td>
                        <td className="text-end">
                          {fmtCLP(item.precio * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>

          {/* Total */}
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
                    <span>
                      {orderData.totales.envio === 0 
                        ? "Gratis" 
                        : fmtCLP(orderData.totales.envio)
                      }
                    </span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between">
                    <strong>Total pagado:</strong>
                    <strong className="text-success fs-4">
                      {fmtCLP(orderData.totales.total)}
                    </strong>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Botones de acción */}
          <div className="d-flex gap-2 justify-content-center mb-4">
            <Button 
              variant="danger" 
              onClick={() => window.print()}
            >
              Imprimir boleta en PDF
            </Button>
            <Button 
              variant="success"
              onClick={() => {
                // Simular envío por email
                alert("Boleta enviada al correo: " + orderData.buyer.correo);
              }}
            >
              Enviar boleta por email
            </Button>
          </div>

          {/* Botón volver */}
          <div className="text-center">
            <Button 
              variant="primary" 
              href="/products"
              size="lg"
            >
              Volver a productos
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
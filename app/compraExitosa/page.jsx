"use client";

import { useEffect, useState } from "react";
import { Container, Card, Row, Col, Table, Button, Alert } from "react-bootstrap";
import { useSearchParams } from "next/navigation";
import { fmtCLP } from "@/lib/formatters";

export default function CompraExitosaPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) return;

      try {
        const res = await fetch(
          `https://ordenes-production-ac23.up.railway.app/api/v1/orders/${orderId}`
        );
        console.log("orderId recibido:", orderId);
        if (!res.ok) throw new Error("No se pudo obtener la orden");

        const data = await res.json();

        // ✅ Parsear los campos TEXT que vienen como string
        const parsedOrder = {
          ...data,
          customerData: JSON.parse(data.customerData),
          cartItems: JSON.parse(data.cartItems),
          totals: JSON.parse(data.totals)
        };

        setOrder(parsedOrder);
      } catch (error) {
        console.error("Error cargando orden:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary"></div>
        <p className="mt-3">Cargando boleta...</p>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container className="py-5">
        <Alert variant="danger">No se encontró la orden.</Alert>
      </Container>
    );
  }

  const { orderNumber, orderCode, customerData, deliveryMethod, cartItems, totals } = order;

  return (
    <Container className="py-5">
      <h1 className="mb-4 text-center">Compra realizada con éxito</h1>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <h4 className="mb-3">Detalles de la orden</h4>
          <p><strong>Número de orden:</strong> {orderNumber}</p>
          <p><strong>Código:</strong> {orderCode}</p>
          <p className="text-muted small">Guarda este código para futuras consultas.</p>
        </Card.Body>
      </Card>

      <Row className="g-4">
        {/* Información del cliente */}
        <Col lg={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Información del cliente</h5>
            </Card.Header>
            <Card.Body>
              <p><strong>Nombre:</strong> {customerData.nombre}</p>
              <p><strong>Apellido:</strong> {customerData.apellido}</p>
              <p><strong>Correo:</strong> {customerData.correo}</p>
            </Card.Body>
          </Card>
        </Col>

        {/* Dirección */}
        <Col lg={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Dirección de entrega</h5>
            </Card.Header>
            <Card.Body>
              {deliveryMethod === "retiro" ? (
                <p>Retiro en tienda. Puedes retirar tu pedido en nuestras tiendas.</p>
              ) : (
                <>
                  <p><strong>Calle:</strong> {customerData.calle}</p>
                  <p><strong>Depto:</strong> {customerData.departamento}</p>
                  <p><strong>Región:</strong> {customerData.region}</p>
                  <p><strong>Comuna:</strong> {customerData.comuna}</p>
                  <p><strong>Indicaciones:</strong> {customerData.indicaciones}</p>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Productos */}
      <Card className="shadow-sm my-4">
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">Detalle de productos</h5>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, i) => (
                <tr key={i}>
                  <td>{item.nombre}</td>
                  <td>{fmtCLP(item.precio)}</td>
                  <td>{item.quantity}</td>
                  <td>{fmtCLP(item.precio * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <hr />

          <p><strong>Subtotal:</strong> {fmtCLP(totals.subtotal)}</p>
          <p><strong>Envío:</strong> {fmtCLP(totals.envio)}</p>
          <h4 className="text-primary"><strong>Total pagado:</strong> {fmtCLP(totals.total)}</h4>
        </Card.Body>
      </Card>

      {/* Botones */}
      <div className="d-flex gap-3 justify-content-center mt-4">
        <Button variant="secondary" onClick={() => window.print()}>
          Imprimir boleta
        </Button>

        <Button
          variant="outline-primary"
          onClick={() => alert("Simulación: aquí se enviaría la boleta por correo.")}
        >
          Enviar por correo
        </Button>

        <Button href="/products" variant="success">
          Volver a productos
        </Button>
      </div>
    </Container>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Breadcrumb,
  Card,
  Spinner,
} from "react-bootstrap";
import Link from "next/link";

export default function DetalleProducto() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [relacionados, setRelacionados] = useState([]);
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    if (!id) return;

    const fetchProducto = async () => {
      try {
        const res = await fetch(`/api/products/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Error al cargar producto");
        const data = await res.json();
        setProducto(data);

        // ✅ cargar productos relacionados por categoría
        const resRel = await fetch(`/api/products?categoria=${data.categoria}`);
        if (resRel.ok) {
          const dataRel = await resRel.json();
          // filtrar el mismo producto
          setRelacionados(dataRel.filter((p) => p.id !== data.id));
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducto();
  }, [id]);

  const handleAgregarCarrito = () => {
    console.log("Añadido al carrito:", { producto, cantidad });
  };

  if (!producto) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" /> <p>Cargando producto...</p>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      {/* Breadcrumb */}
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} href="/">Inicio</Breadcrumb.Item>
        <Breadcrumb.Item active>{producto.categoria}</Breadcrumb.Item>
        <Breadcrumb.Item active>{producto.nombre}</Breadcrumb.Item>
      </Breadcrumb>

      {/* Detalle del producto */}
      <Row className="g-4 align-items-start mb-5">
        <Col md={6}>
          <Card className="shadow-sm border-0">
            <Card.Img
              variant="top"
              src={producto.imagen}
              alt={producto.nombre}
              style={{ objectFit: "cover", maxHeight: "400px" }}
            />
          </Card>
        </Col>

        <Col md={6}>
          <h2 className="mb-3">{producto.nombre}</h2>
          <p className="h4 text-success fw-bold mb-3">${producto.precio}</p>
          <p className="text-muted mb-4">{producto.descripcion}</p>

          <Row className="g-2 align-items-center mb-4">
            <Col xs="auto">
              <label htmlFor="cantidad" className="fw-bold">
                Cantidad:
              </label>
            </Col>
            <Col xs="auto">
              <Form.Control
                type="number"
                id="cantidad"
                min="1"
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value))}
                style={{ width: "80px" }}
              />
            </Col>
          </Row>

          <Button variant="primary" size="lg" onClick={handleAgregarCarrito}>
            Añadir al carrito
          </Button>
        </Col>
      </Row>

      {/* Productos relacionados */}
      {relacionados.length > 0 && (
        <>
          <h3 className="mb-4">Productos relacionados</h3>
          <Row className="g-4">
            {relacionados.slice(0, 3).map((rel) => (
              <Col key={rel.id} xs={12} sm={6} lg={4}>
                <Card className="h-100 shadow-sm">
                  <Card.Img
                    variant="top"
                    src={rel.imagen}
                    alt={rel.nombre}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{rel.nombre}</Card.Title>
                    <Card.Text className="text-success fw-bold">
                      ${rel.precio}
                    </Card.Text>
                    <div className="mt-auto">
                      <Link href={`/products/${rel.id}`} passHref>
                        <Button variant="outline-primary" size="sm">
                          Ver detalle
                        </Button>
                      </Link>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </Container>
  );
}
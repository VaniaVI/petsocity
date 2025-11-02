"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Row, Col, Button, Form } from "react-bootstrap";
import { Link } from "react-bootstrap-icons";
import { addToCart } from "@/hooks/shoppingCart";

export default function DetalleProducto() {
  const { id } = useParams(); // obtiene el id de la URL
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);

  // Cargar producto desde la API
  useEffect(() => {
    if (!id) return;

    const fetchProducto = async () => {
      try {
        const res = await fetch(`/api/products/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Error al cargar producto");
        const data = await res.json();
        setProducto(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducto();
  }, [id]);

  const handleAgregarCarrito = () => {
    const cant = Math.max(1, Math.min(10, Number(cantidad) || 1)); // respeta MAX=10
    addToCart(
      {
        id: producto.id,
        nombre: producto.nombre,
        precio: Number(producto.precio) || 0,
        img: producto.imagen ?? null,
      },
      cant
    );
  };

  if (!producto) {
    return <p className="text-center mt-5">Cargando producto...</p>;
  }

  return (
    <main className="container mt-3 pt-3">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link href="/">Inicio</Link></li>
          <li className="breadcrumb-item">{producto.categoria}</li>
          <li className="breadcrumb-item active" aria-current="page">
            {producto.nombre}
          </li>
        </ol>
      </nav>

      {/* Detalle del producto */}
      <Row className="g-4 align-items-start producto-detalle">
        {/* Columna izquierda: imagen */}
        <Col md={6}>
          <div className="mb-3 imagen-principal-wrapper">
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="img-fluid"
            />
          </div>
        </Col>

        {/* Columna derecha: información */}
        <Col md={6}>
          <h1 className="h3 mb-3">{producto.nombre}</h1>
          <p className="h4 text-success mb-3">${producto.precio}</p>
          <p className="mb-4">{producto.descripcion}</p>

          <Row className="g-2 align-items-center mb-3">
            <Col xs="auto">
              <label htmlFor="cantidad" className="col-form-label fw-bold">
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

      {/* Productos relacionados (ejemplo: misma categoría) */}
      {/* Aquí podrías hacer otro fetch a /api/products y filtrar por categoría */}
    </main>
  );
}
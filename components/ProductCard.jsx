// components/ProductCard.jsx
"use client";

import Link from "next/link";
import { Button, Card } from "react-bootstrap";
import { fmtCLP } from "@/lib/formatters.js";

export default function ProductCard({ product }) {

  // Adaptación segura para datos del backend
  const id = product.idProducto;
  const nombre = product.nombre;
  const precio = product.precio;
  const imagen = product.imagenUrl ?? "/placeholder.jpg";

  return (
    <Card style={{ width: "18rem" }} className="h-80">
      <div style={{ height: "300px" }} className="w-100 overflow-hidden">
        <Card.Img
          variant="top"
          src={imagen}
          className="w-100 h-100"
          style={{ objectFit: "cover" }}
          alt={nombre}
        />
      </div>

      <Card.Body className="d-flex flex-column justify-content-between">
        <Card.Title>{nombre}</Card.Title>

        <Card.Text>
          <strong>{fmtCLP(precio)}</strong>
        </Card.Text>

        <Button as={Link} href={`/products/${id}`} variant="primary">
          Ver detalle
        </Button>
      </Card.Body>
    </Card>
  );
}

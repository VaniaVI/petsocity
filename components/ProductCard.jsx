// components/ProductCard.jsx
"use client";
import Link from "next/link";
import { Button, Card } from "react-bootstrap";
import { fmtCLP } from "@/lib/formatters.js";

export default function ProductCard({ product }) {
  return (
    <Card style={{ width: "18rem" }} className="h-80">
      <div style={{ height: "300px" }} className="w-100 overflow-hidden">
        <Card.Img
          variant="top"
          src={product.imagen}
          className="w-100 h-100"
          style={{ objectFit: "cover" }}
        />
      </div>

      <Card.Body className="d-flex flex-column justify-content-between">
        <Card.Title>{product.nombre}</Card.Title>
        <Card.Text>
          <strong>{fmtCLP(product.precio)}</strong>
        </Card.Text>

        {/* Aquí: Button usa Link internamente */}
        <Button as={Link} href={`/products/${product.id}`} variant="primary">
          Ver detalle
        </Button>
      </Card.Body>
    </Card>
  );
}

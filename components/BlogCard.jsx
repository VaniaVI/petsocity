import Link from "next/link";
import { Card, Button } from "react-bootstrap";

export default function BlogCard({ post }) {
  return (
    <Card className="h-100 d-flex flex-column shadow-sm" style={{ minHeight: 420 }}>
      <Card.Img
        variant="top"
        src={post.imagen}
        alt={post.titulo}
        style={{ objectFit: "cover", height: "200px" }}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title className="fs-5">{post.titulo}</Card.Title>

        {/* Descripción limitada a 2 líneas */}
        <Card.Text
          className="flex-grow-1 text-muted card-text-clamp"
        >
          {post.resumen}
        </Card.Text>

        {/* Botón centrado */}
        <div className="mt-auto d-flex justify-content-center">
          <Link href={`/blog/${post.id}`} passHref>
            <Button variant="primary">Leer más</Button>
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
}
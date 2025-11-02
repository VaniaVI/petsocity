import Link from "next/link";
import { Card, Button } from "react-bootstrap";

export default function BlogCard({ post }) {
  return (
    <Card className="h-100">
      <Card.Img variant="top" src={post.imagen} alt={post.titulo} />
      <Card.Body>
        <Card.Title>{post.titulo}</Card.Title>
        <Card.Text>{post.resumen}</Card.Text>
        <Link href={`/blog/${post.id}`} passHref>
          <Button variant="primary">Leer más</Button>
        </Link>
      </Card.Body>
    </Card>
  );
}
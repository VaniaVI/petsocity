"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Container, Row, Col, Card, Image, Spinner, Button } from "react-bootstrap";

export default function BlogDetalle() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/blog/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Error al cargar post");
        const data = await res.json();
        setPost(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" /> <p>Cargando...</p>
      </Container>
    );
  }

  if (!post) {
    return <p className="text-center mt-5">Post no encontrado</p>;
  }

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="shadow-lg border-0">
            <Image
              src={post.imagen}
              alt={post.titulo}
              fluid
              rounded
              className="w-100"
              style={{ maxHeight: "400px", objectFit: "cover" }}
            />
            <Card.Body>
              <Card.Title as="h2" className="mb-3 text-center">
                {post.titulo}
              </Card.Title>
              <Card.Text style={{ lineHeight: "1.7", fontSize: "1.1rem" }}>
                {post.contenido}
              </Card.Text>
              {post.link && (
                <div className="text-center mt-4">
                  <Button
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="primary"
                  >
                    Ver fuente
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
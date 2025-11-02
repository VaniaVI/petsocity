"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Container, Spinner } from "react-bootstrap";

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
      <h1 className="mb-3">{post.titulo}</h1>
      <img
        src={post.imagen}
        alt={post.titulo}
        className="img-fluid mb-4 rounded"
      />
      <p>{post.contenido}</p>
      {post.link && (
        <a
          href={post.link}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary mt-3"
        >
          Ver fuente
        </a>
      )}
    </Container>
  );
}
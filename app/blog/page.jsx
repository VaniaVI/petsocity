"use client";

import { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Pagination } from "react-bootstrap";
import BlogCard from "@/components/BlogCard";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3; // 6 posts por página (3 columnas x 2 filas)

  useEffect(() => {
    fetch("/api/blog")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" /> <p>Cargando...</p>
      </Container>
    );
  }

  // Calcular posts de la página actual
  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;
  const currentPosts = posts.slice(indexOfFirst, indexOfLast);

  // Calcular número de páginas
  const totalPages = Math.ceil(posts.length / postsPerPage);

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Blog de Mascotas</h2>
      <Row className="g-4 align-items-stretch">
        {currentPosts.map((post) => (
          <Col key={post.id} xs={12} sm={6} lg={4} className="d-flex">
            <BlogCard post={post} />
          </Col>
        ))}
        {/* Placeholders invisibles para mantener altura en la última página */}
        {currentPosts.length < postsPerPage &&
          Array.from({ length: postsPerPage - currentPosts.length }).map((_, i) => (
            <Col key={`ph-${i}`} xs={12} sm={6} lg={4} className="d-none d-lg-flex">
              <div style={{ visibility: "hidden", width: "100%" }}>
                <BlogCard post={{ titulo: "", resumen: "", imagen: "" }} />
              </div>
            </Col>
          ))}
      </Row>

      {/* Paginación */}
      <div className="d-flex justify-content-center mt-4">
        <Pagination>
          <Pagination.Prev
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          />
          {[...Array(totalPages)].map((_, i) => (
            <Pagination.Item
              key={i + 1}
              active={i + 1 === currentPage}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          />
        </Pagination>
      </div>
    </Container>
  );
}
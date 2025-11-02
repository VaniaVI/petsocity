"use client";

import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import BlogCard from "@/components/BlogCard";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("/api/blog")
      .then((res) => res.json())
      .then(setPosts);
  }, []);

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Blog de Mascotas</h2>
      <Row className="g-4">
        {posts.map((post) => (
          <Col md={6} lg={4} key={post.id}>
            <BlogCard post={post} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}
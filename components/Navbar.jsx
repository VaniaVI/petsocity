'use client';

import { useState } from 'react';
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import Image from "next/image";
import Link from "next/link";
import { PersonCircle, CartPlus } from 'react-bootstrap-icons';
import LoginModal from './LoginModal';
import { useCart } from '@/hooks/useCart';
import { usePathname } from "next/navigation";

export default function NavbarPage() {
  const [showLogin, setShowLogin] = useState(false);
  const { itemCount  } = useCart();
  const pathname = usePathname();

  // función para marcar activo (sin tipos, porque es .jsx)
  const isActive = (path) => pathname === path;

  return (
    <>
      <Navbar expand="lg" bg="light" data-bs-theme="light" className="shadow-sm bg-body-tertiary">
        <Container>
          {/* LOGO */}
          <Navbar.Brand as={Link} href="/" className="fw-bold text-primary d-flex align-items-center">
            <Image 
              src="/logoPetsocity.png"
              alt="Logo PetSocity"
              width={50}
              height={50}
              priority
            />
            <span className="ms-2">PetSocity</span>
          </Navbar.Brand>

          {/* BOTÓN HAMBURGUESA */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          {/* LINKS */}
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link
                as={Link}
                href="/"
                className={`mx-2 fw-semibold ${isActive("/") ? "active-link" : "text-dark"}`}
              >
                Inicio
              </Nav.Link>

              <NavDropdown
                title={<span className="fw-semibold">Productos</span>}
                id="basic-nav-dropdown"
                menuVariant="light"
                className={`mx-2 ${pathname.startsWith("/products") ? "active-link" : "text-dark"}`}
              >
                <NavDropdown.Item as={Link} href="/products">Ver todos los productos</NavDropdown.Item>
                <NavDropdown.Item as={Link} href="/products?category=accesorios">Accesorios</NavDropdown.Item>
                <NavDropdown.Item as={Link} href="/products?category=alimentos">Alimentos</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} href="/products?tag=oferta">Ofertas especiales</NavDropdown.Item>
              </NavDropdown>

              <Nav.Link
                as={Link}
                href="/nosotros"
                className={`mx-2 fw-semibold ${isActive("/nosotros") ? "active-link" : "text-dark"}`}
              >
                Nosotros
              </Nav.Link>

              <Nav.Link
                as={Link}
                href="/contacto"
                className={`mx-2 fw-semibold ${isActive("/contacto") ? "active-link" : "text-dark"}`}
              >
                Contacto
              </Nav.Link>

              {/* Blog → /blog */}
              <Nav.Link
                as={Link}
                href="/blog"
                className={`mx-2 fw-semibold ${isActive("/blog") ? "active-link" : "text-dark"}`}
              >
                Blog
              </Nav.Link>
            </Nav>

            {/* BOTONES DERECHA */}
            <div className="d-flex align-items-center">
              <Button
                variant="outline-primary"
                className="me-2"
                onClick={() => setShowLogin(true)}
              >
                <PersonCircle size={24} />
              </Button>

              <Nav.Link as={Link} href="/carrito" className="mx-2 position-relative">
                <Button variant="outline-secondary">
                  <CartPlus size={24} />

                  {itemCount > 0 && (
                    <span
                      className="position-absolute  badge rounded-pill bg-danger"
                      style={{
                        fontSize: "0.75rem", 
                        transform: "translate(40% , -10%)"
                       }}
                    >
                      {itemCount}
                    </span>
                  )}
                </Button>
              </Nav.Link>

            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Modal de Login */}
      <LoginModal show={showLogin} handleClose={() => setShowLogin(false)} />
    </>
  );
}

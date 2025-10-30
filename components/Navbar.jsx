'use client';
import React from 'react';
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import Image from "next/image";
import { PersonCircle, CartPlus } from 'react-bootstrap-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function CustomNavbar() {
  return (
    <Navbar expand="lg" bg="light" data-bs-theme="light" className="shadow-sm py-3 bg-body-tertiary">
      <Container>
        {/* LOGO */}
        <Navbar.Brand href="/" className="fw-bold text-primary">
          <Image 
            src="/logoPetsocity.png"
            alt="Perro con juguete"
            width={50}
            height={50}
          />
        </Navbar.Brand>

        {/* BOTÓN HAMBURGUESA */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* LINKS */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/" className="mx-2 text-dark fw-semibold">
              Inicio
            </Nav.Link>

            <NavDropdown 
              title={<span className="text-dark fw-semibold">Productos</span>} 
              id="basic-nav-dropdown"
              menuVariant="light"
              className="mx-2"
            >
              <NavDropdown.Item href="#action/3.1">Ver todos los productos</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Accesorios</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Alimentos</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Ofertas especiales</NavDropdown.Item>
            </NavDropdown>

            <Nav.Link href="/nosotros" className="mx-2 text-dark fw-semibold">
              Nosotros
            </Nav.Link>
            <Nav.Link href="/contacto" className="mx-2 text-dark fw-semibold">
              Contacto
            </Nav.Link>
          </Nav>

          {/* BOTONES */}
          <div className="d-flex">
            <Button
              variant="outline-primary"
              className="me-2"
              onClick={() => alert('Abrir modal de login')}
            >
              <PersonCircle size={24} />
            </Button>

            <Nav.Link href="/carrito" className="mx-2">
              <Button variant="outline-secondary">
                <CartPlus size={24} />
              </Button>
            </Nav.Link>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

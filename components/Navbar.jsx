'use client';

import React, { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { useBootstrap } from '@/hooks/useBootstrap';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const { cartCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  // Inicializa Bootstrap (hook personalizado)
  useBootstrap();

  // Cerrar menú al hacer clic en un link
  const handleNavClick = () => setIsOpen(false);

  // Abrir modal de login
  const handleLoginModal = () => {
    setIsOpen(false);
    setTimeout(() => {
      const modalElement = document.getElementById('exampleModal');
      if (modalElement && window.bootstrap) {
        const modal = new window.bootstrap.Modal(modalElement);
        modal.show();
      }
    }, 100);
  };

  return (
    <nav className="navbar navbar-expand-xl navbar-light bg-light custom-navbar" style={{ fontFamily: "'Fredoka', sans-serif" }}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" href="/">
          <Image src="/logoPetsocity.png" alt="Logo Petsocity" height={60} width={60}/>
          <span style={{ fontWeight: 600 }}>PetSocity</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-controls="navbarSupportedContent"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><Link className="nav-link active" href="/" onClick={handleNavClick}>Home</Link></li>

            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Productos
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li><a className="dropdown-item" href="/productos?categoria=todos" onClick={handleNavClick}>Ver todos los productos</a></li>
                <li><a className="dropdown-item" href="/productos?categoria=accesorios" onClick={handleNavClick}>Accesorios</a></li>
                <li><a className="dropdown-item" href="/productos?categoria=alimentos" onClick={handleNavClick}>Alimentos</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item" href="/productos?categoria=ofertas" onClick={handleNavClick}>Ofertas especiales</a></li>
              </ul>
            </li>

            <li className="nav-item"><a className="nav-link" href="/nosotros" onClick={handleNavClick}>Nosotros</a></li>
            <li className="nav-item"><a className="nav-link" href="/blogs" onClick={handleNavClick}>Blogs</a></li>
            <li className="nav-item"><a className="nav-link" href="/paginaContacto" onClick={handleNavClick}>Contacto</a></li>

            {/* Carrito y Login - Versión Móvil */}
            <li className="nav-item d-xl-none mt-3">
              <div className="d-flex align-items-center gap-2">
                <div className="position-relative d-inline-block">
                  <span className="material-symbols-outlined">add_shopping_cart</span>
                  {cartCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {cartCount}
                    </span>
                  )}
                </div>
                <a className="nav-link" href="/carritoCompra" onClick={handleNavClick}>Carrito</a>
              </div>
            </li>

            <li className="nav-item d-xl-none">
              <button type="button" className="btn btn-link nav-link" onClick={handleLoginModal}>
                <span className="material-symbols-outlined">account_circle</span> Iniciar Sesión
              </button>
            </li>
          </ul>

          {/* Carrito y Login - Desktop */}
          <div className="d-none d-xl-flex align-items-center gap-3 pe-3">
            <button type="button" className="btn btn-link p-0 text-dark" onClick={handleLoginModal}>
              <span className="material-symbols-outlined">account_circle</span>
            </button>
            <a href="/carritoCompra" className="d-flex align-items-center gap-2 text-decoration-none text-dark">
              <div className="position-relative d-inline-block">
                <span className="material-symbols-outlined">add_shopping_cart</span>
                {cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartCount}
                  </span>
                )}
              </div>
              <span>Carrito</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

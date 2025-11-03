'use client';

import { useState } from "react";
import Link from "next/link";
import { CreditCard2Back, CreditCardFill, CreditCard } from "react-bootstrap-icons";

export default function Footer() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState(""); // ✅ estado para el input

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    setSent(true);
    setEmail(""); // ✅ limpiar campo después de enviar

    // Ocultar el mensaje después de 3 segundos
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <footer className="footer bg-white text-black pt-5 pb-4 mt-4 border-top">
      <div className="container">
        <div className="row gy-4">
          {/* Sección 1: descripción */}
          <div className="col-md-4">
            <h6 className="text-uppercase fw-bold mb-2">PetSocity</h6>
            <p className="mb-3">Tu tienda online de productos y accesorios para mascotas.</p>

            <div className="d-flex flex-wrap align-items-center gap-3">
              <CreditCard2Back size={26} />
              <CreditCardFill size={26} />
              <CreditCard size={26} />
            </div>
          </div>

          {/* Sección 2: enlaces */}
          <div className="col-md-3">
            <h6 className="text-uppercase fw-bold mb-2">Links</h6>
            <ul className="list-unstyled mb-0">
              <li><Link href="/products" className="footer-link d-inline-block py-1">Productos</Link></li>
              <li><Link href="/nosotros" className="footer-link d-inline-block py-1">Nosotros</Link></li>
              <li><Link href="/blog" className="footer-link d-inline-block py-1">Blog</Link></li>
              <li><Link href="/contacto" className="footer-link d-inline-block py-1">Contacto</Link></li>
            </ul>
          </div>

          {/* Sección 3: Newsletter */}
          <div className="col-md-5">
            <h6 className="text-uppercase fw-bold mb-3">Suscríbete a nuestro newsletter</h6>
            <form className="d-flex flex-wrap gap-2" onSubmit={handleSubmit}>
              <div className="form-floating flex-grow-1" style={{ maxWidth: 340 }}>
                <input
                  type="email"
                  className="form-control"
                  id="newsletterEmail"
                  placeholder="name@example.com"
                  value={email} // ✅ controlado por estado
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label htmlFor="newsletterEmail">Correo electrónico</label>
              </div>

              <button type="submit" className="btn btn-primary fw-semibold px-3">
                Suscríbete
              </button>
            </form>

            {/* Mensaje de confirmación */}
            {sent && (
              <div className="alert alert-success mt-3 py-2 px-3" role="alert">
                ✅ Correo enviado con éxito
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="text-center pt-3 mt-4 border-top">
        <p className="mb-0">&copy; 2025 PetSocity. Todos los derechos reservados.</p>
      </div>

      <style jsx>{`
        .footer-link {
          color: var(--foreground);
          text-decoration: none;
          border-radius: 6px;
          padding: 4px 8px;
          transition: background-color 0.2s ease, color 0.2s ease;
        }
        .footer-link:hover {
          background-color: rgba(0, 0, 0, 0.06);
          color: var(--primary);
        }
      `}</style>
    </footer>
  );
}

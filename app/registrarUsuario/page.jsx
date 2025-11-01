"use client";

import { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import LoginModal from "../../components/LoginModal";
import { useCart } from "../../hooks/useCart";

export default function RegistrarUsuario() {
  const { cartCount } = useCart();

  const [formData, setFormData] = useState({
    nombreCompleto: "",
    correo: "",
    verificarCorreo: "",
    password: "",
    verificarPassword: "",
    telefono: "",
    region: "",
    comuna: "",
    terminos: false,
  });

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [id]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos enviados:", formData);
    // Aquí podrías integrar validaciones adicionales o enviar a una API
  };

  return (
    <>
      {/* Navbar global */}
      <Navbar cartCount={cartCount} />
      <LoginModal />

      {/* Contenido principal */}
      <main className="container pt-4">
        <article className="mb-5">
          <div className="registro-wrapper mx-auto" style={{ maxWidth: "600px" }}>
            <div className="registro-card">
              <div className="mb-4 p-3 d-flex justify-content-center">
                <h1 className="mb-0 fs-2">Registro de usuario</h1>
              </div>

              <Form noValidate onSubmit={handleSubmit}>
                {/* Nombre completo */}
                <Form.Group className="mb-3" controlId="nombreCompleto">
                  <Form.Label>Nombre completo</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    maxLength={50}
                    pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+"
                    title="Solo letras y espacios hasta 50 caracteres"
                    value={formData.nombreCompleto}
                    onChange={handleChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    Ingresa tu nombre completo
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Correo */}
                <Form.Group className="mb-3" controlId="correo">
                  <Form.Label>Correo</Form.Label>
                  <Form.Control
                    type="email"
                    required
                    pattern="^[a-zA-Z0-9._%+-]+@duoc\\.cl$"
                    title="Debe ser un correo válido con dominio @duoc.cl"
                    value={formData.correo}
                    onChange={handleChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    Ingrese correo válido
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Confirmar correo */}
                <Form.Group className="mb-3" controlId="verificarCorreo">
                  <Form.Label>Confirmar correo</Form.Label>
                  <Form.Control
                    type="email"
                    required
                    pattern="^[a-zA-Z0-9._%+-]+@duoc\\.cl$"
                    title="Debe ser un correo válido con dominio @duoc.cl"
                    value={formData.verificarCorreo}
                    onChange={handleChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    Los correos deben coincidir
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Contraseña */}
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    required
                    minLength={8}
                    title="Debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo especial"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    Ingrese contraseña segura
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Confirmar contraseña */}
                <Form.Group className="mb-3" controlId="verificarPassword">
                  <Form.Label>Confirmar contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    required
                    minLength={8}
                    value={formData.verificarPassword}
                    onChange={handleChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    Ingrese contraseña segura
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Teléfono */}
                <Form.Group className="mb-3" controlId="telefono">
                  <Form.Label>Teléfono (opcional)</Form.Label>
                  <Form.Control
                    type="tel"
                    pattern="^(\\+?56)?(9\\d{8})?$"
                    title="Debe ser un número válido, como: 912345678"
                    value={formData.telefono}
                    onChange={handleChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    Número inválido
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Región y comuna */}
                <Row className="g-3">
                  <Col md={12}>
                    <div className="p-4 shadow-sm">
                      <Form.Label className="fw-semibold text-primary">
                        Región
                      </Form.Label>
                      <Form.Select
                        id="region"
                        required
                        value={formData.region}
                        onChange={handleChange}
                      >
                        <option value="">Selecciona tu región</option>
                        <option value="rm">Región Metropolitana de Santiago</option>
                        <option value="araucania">Región de la Araucanía</option>
                        <option value="nuble">Región de Ñuble</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        Por favor selecciona una región
                      </Form.Control.Feedback>
                    </div>
                  </Col>
                  <Col md={12}>
                    <div className="p-4 shadow-sm">
                      <Form.Label className="fw-semibold text-primary">
                        Comuna
                      </Form.Label>
                      <Form.Select
                        id="comuna"
                        required
                        value={formData.comuna}
                        onChange={handleChange}
                      >
                        <option value="">Seleccione la comuna</option>
                        <option value="linares">Linares</option>
                        <option value="longavi">Longaví</option>
                        <option value="concepcion">Concepción</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        Por favor selecciona una comuna
                      </Form.Control.Feedback>
                    </div>
                  </Col>
                </Row>

                {/* Términos y condiciones */}
                <Form.Group className="mb-3 mt-3" controlId="terminos">
                  <Form.Check
                    type="checkbox"
                    label="Acepto los términos y condiciones"
                    required
                    checked={formData.terminos}
                    onChange={handleChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    Debes aceptar los términos.
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Botón de registro */}
                <div className="text-center mt-4">
                  <Button type="submit" variant="primary" className="btn-final">
                    Registrar
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </article>
      </main>

      {/* Footer global */}
      <Footer />
    </>
  );
}
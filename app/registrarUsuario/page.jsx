"use client";

import { useState } from "react";
import {
  Row,
  Col,
  Form,
  Button,
  Container,
  Card,
  InputGroup,
} from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";

export default function RegistrarUsuario() {
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

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [id]: type === "checkbox" ? checked : value,
    });
  };

  const validate = () => {
    let newErrors = {};

    // Nombre
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,50}$/.test(formData.nombreCompleto)) {
      newErrors.nombreCompleto = "Solo letras y espacios (máx 50 caracteres)";
    }

    // Correo
    if (!/^[a-zA-Z0-9._%+-]+@duoc\.cl$/.test(formData.correo)) {
      newErrors.correo = "Debe ser un correo válido con dominio @duoc.cl";
    }

    // Confirmar correo
    if (formData.correo !== formData.verificarCorreo) {
      newErrors.verificarCorreo = "Los correos no coinciden";
    }

    // Password
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,}$/.test(
        formData.password
      )
    ) {
      newErrors.password =
        "Debe tener al menos 8 caracteres, incluir mayúscula, minúscula, número y símbolo";
    }

    // Confirmar password
    if (formData.password !== formData.verificarPassword) {
      newErrors.verificarPassword = "Las contraseñas no coinciden";
    }

    // Teléfono (opcional)
    if (formData.telefono && !/^9\d{8}$/.test(formData.telefono)) {
      newErrors.telefono = "Debe ser un número válido, ej: 912345678";
    }

    // Región y comuna
    if (!formData.region) newErrors.region = "Selecciona una región";
    if (!formData.comuna) newErrors.comuna = "Selecciona una comuna";

    // Términos
    if (!formData.terminos) {
      newErrors.terminos = "Debes aceptar los términos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Datos enviados:", formData);
      alert("Registro exitoso ✅");

      // 🔹 Reiniciar los campos
      setFormData({
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

      // 🔹 También limpiar errores
      setErrors({});
    }
  };


  return (
    <Container className="pt-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-lg border-0">
            <Card.Body>
              <h1 className="text-center mb-4">Registro de usuario</h1>

              <Form noValidate onSubmit={handleSubmit}>
                {/* Nombre */}
                <Form.Group className="mb-3" controlId="nombreCompleto">
                  <Form.Label>Nombre completo</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.nombreCompleto}
                    onChange={handleChange}
                    isInvalid={!!errors.nombreCompleto}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.nombreCompleto}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Correo */}
                <Form.Group className="mb-3" controlId="correo">
                  <Form.Label>Correo</Form.Label>
                  <Form.Control
                    type="email"
                    value={formData.correo}
                    onChange={handleChange}
                    isInvalid={!!errors.correo}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.correo}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Confirmar correo */}
                <Form.Group className="mb-3" controlId="verificarCorreo">
                  <Form.Label>Confirmar correo</Form.Label>
                  <Form.Control
                    type="email"
                    value={formData.verificarCorreo}
                    onChange={handleChange}
                    isInvalid={!!errors.verificarCorreo}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.verificarCorreo}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Password */}
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Contraseña</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      isInvalid={!!errors.password}
                    />
                    <Button
                      variant="outline-secondary"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeSlash /> : <Eye />}
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                {/* Confirmar password */}
                <Form.Group className="mb-3" controlId="verificarPassword">
                  <Form.Label>Confirmar contraseña</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword2 ? "text" : "password"}
                      value={formData.verificarPassword}
                      onChange={handleChange}
                      isInvalid={!!errors.verificarPassword}
                    />
                    <Button
                      variant="outline-secondary"
                      type="button"
                      onClick={() => setShowPassword2(!showPassword2)}
                    >
                      {showPassword2 ? <EyeSlash /> : <Eye />}
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      {errors.verificarPassword}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                {/* Teléfono */}
                <Form.Group className="mb-3" controlId="telefono">
                  <Form.Label>Teléfono (opcional)</Form.Label>
                  <Form.Control
                    type="tel"
                    value={formData.telefono}
                    onChange={handleChange}
                    isInvalid={!!errors.telefono}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.telefono}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Región y comuna */}
                <Row className="g-3">
                  <Col md={12}>
                    <Form.Label>Región</Form.Label>
                    <Form.Select
                      id="region"
                      value={formData.region}
                      onChange={handleChange}
                      isInvalid={!!errors.region}
                    >
                      <option value="">Selecciona tu región</option>
                      <option value="rm">Región Metropolitana</option>
                      <option value="araucania">Araucanía</option>
                      <option value="nuble">Ñuble</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.region}
                    </Form.Control.Feedback>
                  </Col>
                  <Col md={12}>
                    <Form.Label>Comuna</Form.Label>
                    <Form.Select
                      id="comuna"
                      value={formData.comuna}
                      onChange={handleChange}
                      isInvalid={!!errors.comuna}
                    >
                      <option value="">Seleccione la comuna</option>
                      <option value="linares">Linares</option>
                      <option value="longavi">Longaví</option>
                      <option value="concepcion">Concepción</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.comuna}
                    </Form.Control.Feedback>
                  </Col>
                </Row>

                {/* Términos */}
                <Form.Group className="mb-3 mt-3" controlId="terminos">
                  <Form.Check
                    type="checkbox"
                    label="Acepto los términos y condiciones"
                    required
                    checked={formData.terminos}
                    onChange={handleChange}
                    isInvalid={!!errors.terminos}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.terminos}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Botón de registro */}
                <div className="text-center mt-4">
                  <Button type="submit" variant="primary" className="btn-final">
                    Registrar
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
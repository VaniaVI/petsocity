// app/registroUsuario/page.jsx
"use client";
import { useState } from "react";
import { Row, Col, Form, Button, Container, Card, InputGroup } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { registroValidationRules , useFormValidation } from "@/hooks/useFormValidation";
import { crearCliente } from "@/lib/services/clientService";

export default function RegistrarUsuario() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  // ✅ Hook de validación
  const {
    formData,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    validateForm,
    touchAllFields,
    resetForm,
    setIsSubmitting,
  } = useFormValidation(
    {
      nombreCompleto: "",
      correo: "",
      verificarCorreo: "",
      password: "",
      verificarPassword: "",
      telefono: "",
      region: "",
      comuna: "",
      terminos: false,
    },
    registroValidationRules 
  );

  // ✅ Manejo del submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    touchAllFields(); // Marca todos los campos como 'tocados' para forzar la visualización del rojo

    if (!validateForm()) {
      // 🚨 CORRECCIÓN: Si la validación falla, simplemente detenemos la función.
      // Los errores se muestran automáticamente en el formulario.
      return; 
    }

    setIsSubmitting(true);

    try {
      // Lógica de negocio (Crear cliente)
      const nombreCompleto = formData.nombreCompleto.trim();
      const partes = nombreCompleto.split(" ");
      const nombre = partes[0];
      const apellidos = partes.slice(1).join(" ") || nombre;

      const clienteData = {
        nombre,
        apellidos,
        correo: formData.correo,
        telefono: formData.telefono || null,
        direccion: {
          region: formData.region,
          comuna: formData.comuna,
        },
      };

      await crearCliente(clienteData); 

      // Guarda el correo para autocompletar el checkout
      if (typeof window !== "undefined") {
        localStorage.setItem("clienteCorreo", formData.correo);
      }

      alert("Registro exitoso ✅"); 
      console.log("Se guarda cliente" , JSON.stringify(clienteData, null, 2));
      resetForm();

    } catch (error) {
      console.error("Error en registro:", error);
      alert("Hubo un problema al registrar el usuario. Intenta nuevamente. Error: " + error.message);
    } finally {
      setIsSubmitting(false);
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
                <Form.Group className="mb-3">
                  <Form.Label>Nombre completo</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombreCompleto"
                    value={formData.nombreCompleto}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.nombreCompleto && !!errors.nombreCompleto}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.nombreCompleto}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Correo */}
                <Form.Group className="mb-3">
                  <Form.Label>Correo</Form.Label>
                  <Form.Control
                    type="email"
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.correo && !!errors.correo}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.correo}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Confirmar correo */}
                <Form.Group className="mb-3">
                  <Form.Label>Confirmar correo</Form.Label>
                  <Form.Control
                    type="email"
                    name="verificarCorreo"
                    value={formData.verificarCorreo}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.verificarCorreo && !!errors.verificarCorreo}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.verificarCorreo}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Password */}
                <Form.Group className="mb-3">
                  <Form.Label>Contraseña</Form.Label>
                  {/* hasValidation necesario para tooltips en InputGroup */}
                  <InputGroup hasValidation>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.password && !!errors.password}
                    />
                    <Button
                      variant="outline-secondary"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeSlash /> : <Eye />}
                    </Button>
                    <Form.Control.Feedback type="invalid" tooltip>
                      {errors.password}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                {/* Confirmar password */}
                <Form.Group className="mb-3">
                  <Form.Label>Confirmar contraseña</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      type={showPassword2 ? "text" : "password"}
                      name="verificarPassword"
                      value={formData.verificarPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.verificarPassword && !!errors.verificarPassword}
                    />
                    <Button
                      variant="outline-secondary"
                      type="button"
                      onClick={() => setShowPassword2(!showPassword2)}
                    >
                      {showPassword2 ? <EyeSlash /> : <Eye />}
                    </Button>
                    <Form.Control.Feedback type="invalid" tooltip>
                      {errors.verificarPassword}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                {/* Teléfono */}
                <Form.Group className="mb-3">
                  <Form.Label>Teléfono (opcional)</Form.Label>
                  <Form.Control
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.telefono && !!errors.telefono}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.telefono}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Región y comuna */}
                <Row className="g-3">
                  <Col md={12} className="mb-3">
                    <Form.Label>Región</Form.Label>
                    <Form.Select
                      name="region"
                      value={formData.region}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.region && !!errors.region}
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
                      name="comuna"
                      value={formData.comuna}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.comuna && !!errors.comuna}
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
                <Form.Group className="mb-3 mt-3">
                  <Form.Check
                    type="checkbox"
                    label="Acepto los términos y condiciones"
                    name="terminos"
                    checked={formData.terminos}
                    onChange={handleChange}
                    isInvalid={touched.terminos && !!errors.terminos}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.terminos}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Botón de registro */}
                <div className="text-center mt-4">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    className="btn-final"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Registrando..." : "Registrar"}
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
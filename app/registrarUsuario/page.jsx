// app/registroUsuario/page.jsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Row, Col, Form, Button, Container, Card, InputGroup } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { registroValidationRules , useFormValidation } from "@/hooks/useFormValidation";
import { setClienteId, setClienteCorreo, setClienteNombre } from "@/lib/services/clientService";


export default function RegistrarUsuario() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const router = useRouter();



  // Hook de validación
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
      direccion: "", // <- nuevo campo
      region: "",
      comuna: "",
      terminos: false,
    },
    registroValidationRules 
  );

  // Manejo del submit
  const handleSubmit = async (e) => {
  e.preventDefault();
  touchAllFields();

  if (!validateForm()) return;

  setIsSubmitting(true);

  try {
    // Separar nombre y apellido
    const nombreCompleto = formData.nombreCompleto.trim();
    const partes = nombreCompleto.split(" ");
    const nombre = partes[0];
    const apellido = partes.slice(1).join(" ") || nombre;

    // Preparar datos para enviar al backend
    const clienteData = {
      nombre,
      apellido,
      email: formData.correo,
      contrasenia: formData.password,
      telefono: formData.telefono || "",
      direccion: formData.direccion || "", 
      region: formData.region,
      comuna: formData.comuna,
    };

    // Enviar datos al backend
    const res = await fetch("https://petsocitymicroservicio-production.up.railway.app/api/v1/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(clienteData), // <-- enviamos clienteData
    });

if (!res.ok) {
  const errorData = await res.json();
  console.log("Error del backend:", errorData); // <- esto te mostrará todo
  throw new Error(errorData.message || errorData.mensaje || "Error al registrar usuario");
}


    const usuarioCreado = await res.json();

    // Guardar ID y correo en frontend para otros microservicios
    setClienteId(usuarioCreado.id);
    setClienteCorreo(usuarioCreado.email);
    setClienteNombre(usuarioCreado.nombre);

    alert("Registro exitoso ✅");
    resetForm();
    router.push("/");
  } catch (error) {
    console.error("Error en registro:", error);
    alert("Hubo un problema al registrar el usuario. Intenta nuevamente. Error: " + error.message);
  } finally {
    setIsSubmitting(false);
  }
};

  useEffect(() => {
    fetch("https://petsocitymicroservicio-production.up.railway.app/api/v1/usuarios/regiones")
      .then(res => res.json())
      .then(data => setRegiones(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (!selectedRegion) return;

    fetch(`https://petsocitymicroservicio-production.up.railway.app/api/v1/usuarios/regiones/${selectedRegion}/comunas`)
      .then(res => res.json())
      .then(data => setComunas(data))
      .catch(err => console.error(err));
  }, [selectedRegion]);



  return (
    <Container className="pt-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-lg border-0">
            <Card.Body>
              <h1 className="text-center mb-4">Registro de usuario</h1>

              <Form noValidate onSubmit={handleSubmit}>
                {/* Nombre completo */}
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
                    {errors.email}
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

                {/* Contraseña */}
                <Form.Group className="mb-3">
                  <Form.Label>Contraseña</Form.Label>
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

                {/* Confirmar contraseña */}
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

                {/* Dirección */}
                <Form.Group className="mb-3">
                  <Form.Label>Dirección (calle, número, referencia)</Form.Label>
                  <Form.Control
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.direccion && !!errors.direccion}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.direccion}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Región y comuna */}
                <Row className="g-3">
                  <Col md={12} className="mb-3">
                    <Form.Label>Región</Form.Label>
                    <Form.Select
                      name="region"
                      value={formData.region}
                      onChange={(e) => {
                        handleChange(e); // actualiza formData.region
                        setSelectedRegion(e.target.value); // actualiza el estado para cargar comunas
                      }}
                      onBlur={handleBlur}
                      isInvalid={touched.region && !!errors.region}
                    >
                      <option value="">Selecciona tu región</option>
                      {regiones.map((r) => (
                        <option key={r.codigo} value={r.codigo}>
                          {r.nombre}
                        </option>
                      ))}
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
                      {comunas.map((c) => (
                        <option key={c.codigo} value={c.codigo}>
                          {c.nombre}
                        </option>
                      ))}
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

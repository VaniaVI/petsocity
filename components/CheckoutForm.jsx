"use client";
import { Form, Row, Col, Button } from "react-bootstrap";
import { fmtCLP } from "@/lib/formatters";
import { useEffect, useState } from "react";

export default function CheckoutForm({
  formData,
  setFormData,
  errors,
  touched,
  metodo,
  setMetodo,
  handleChange,
  handleBlur,
  handleSubmit,
  total,
}) {

  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);

  useEffect(() => {
  fetch("https://petsocitymicroservicio-production.up.railway.app/api/v1/usuarios/regiones")
    .then(res => res.json())
    .then(data => setRegiones(data))
    .catch(err => console.error(err));
}, []);

useEffect(() => {
  if (!formData.region) return;

  fetch(`https://petsocitymicroservicio-production.up.railway.app/api/v1/usuarios/regiones/${formData.region}/comunas`)
    .then(res => res.json())
    .then(data => setComunas(data))
    .catch(err => console.error(err));
}, [formData.region]);



  return (
    <Form onSubmit={handleSubmit} noValidate>
      {/* ========== MÉTODO DE ENTREGA ========== */}
      <div className="mb-4">
        <h5 className="mb-3">Método de entrega</h5>
        <div className="d-flex gap-3">
          <Form.Check
            type="radio"
            id="metodo-domicilio"
            name="metodo"
            label="Envío a domicilio"
            checked={metodo === "domicilio"}
            onChange={() => setMetodo("domicilio")}
          />
          <Form.Check
            type="radio"
            id="metodo-retiro"
            name="metodo"
            label="Retiro en tienda"
            checked={metodo === "retiro"}
            onChange={() => setMetodo("retiro")}
          />
        </div>
      </div>

      <hr className="my-4" />

      {/* ========== INFORMACIÓN DEL CLIENTE ========== */}
      <h5 className="mb-3">Información del cliente</h5>
      <p className="text-muted small mb-3">
        {formData.correo 
          ? "✅ Datos cargados automáticamente. Puedes modificarlos si lo deseas." 
          : "Completa la siguiente información"}
      </p>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Nombre*</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.nombre && !!errors.nombre}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.nombre}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Apellidos*</Form.Label>
            <Form.Control
              type="text"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.apellidos && !!errors.apellidos}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.apellidos}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Correo*</Form.Label>
            <Form.Control
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.correo && !!errors.correo}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.correo}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Confirmar Correo*</Form.Label>
            <Form.Control
              type="email"
              name="verificarCorreo"
              value={formData.verificarCorreo}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.verificarCorreo && !!errors.verificarCorreo}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.verificarCorreo}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <hr className="my-4" />

      {/* ========== DIRECCIÓN DE ENTREGA ========== */}
      <h5 className="mb-3">Dirección de entrega</h5>
      <p className="text-muted small mb-3">
        {metodo === "retiro" 
          ? "Puedes retirar en nuestra tienda ubicada en..." 
          : "Ingrese dirección de forma detallada"}
      </p>

      <Row className="mb-3">
        <Col md={12}>
          <Form.Group>
            <Form.Label>Calle{metodo === "domicilio" && "*"}</Form.Label>
            <Form.Control
              type="text"
              name="calle"
              value={formData.calle}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.calle && !!errors.calle}
              required={metodo === "domicilio"}
              disabled={metodo === "retiro"}
              placeholder="Ej: Los crisantemos 1234, Edificio Norte"
            />
            <Form.Control.Feedback type="invalid">
              {errors.calle}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Región{metodo === "domicilio" && "*"}</Form.Label>
            <Form.Select
              name="region"
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              onBlur={handleBlur}
              isInvalid={touched.region && !!errors.region}
              disabled={metodo === "retiro"}
            >
              <option value="">Selecciona una región</option>
              {regiones.map(r => (
                <option key={r.codigo} value={r.codigo}>{r.nombre}</option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.region}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Comuna{metodo === "domicilio" && "*"}</Form.Label>
            <Form.Select
              name="comuna"
              value={formData.comuna}
              onChange={(e) => setFormData({ ...formData, comuna: e.target.value })}
              onBlur={handleBlur}
              isInvalid={touched.comuna && !!errors.comuna}
              disabled={metodo === "retiro"}
            >
            <option value="">Selecciona una comuna</option>
              {comunas.map(r => (
                <option key={r.codigo} value={r.codigo}>{r.nombre}</option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.comuna}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-4">
        <Form.Label>Indicaciones para la entrega (opcional)</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="indicaciones"
          placeholder="Ej: El martes no estaremos, puede dejarlo con el conserje."
          value={formData.indicaciones}
          onChange={handleChange}
          disabled={metodo === "retiro"}
        />
      </Form.Group>

      <div className="d-grid">
        <Button variant="success" size="lg" type="submit">
          Pagar ahora {fmtCLP(total)}
        </Button>
      </div>
    </Form>
  );
}

// components/checkout/CheckoutForm.jsx
import { Form, Row, Col, Button } from "react-bootstrap";
import { fmtCLP } from "@/lib/formatters";

export default function CheckoutForm({
  formData,
  errors,
  touched,
  metodo,
  handleChange,
  handleBlur,
  handleSubmit,
  total,
}) {
  return (
    <Form onSubmit={handleSubmit} noValidate>
      {/* Información del cliente */}
      <h5 className="mb-3">Información del cliente</h5>
      <p className="text-muted small mb-3">Completa la siguiente información</p>

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

      {/* Dirección de entrega */}
      <h5 className="mb-3">Dirección de entrega de los productos</h5>
      <p className="text-muted small mb-3">Ingrese dirección de forma detallada</p>

      <Row className="mb-3">
        <Col md={8}>
          <Form.Group>
            <Form.Label>Calle*</Form.Label>
            <Form.Control
              type="text"
              name="calle"
              value={formData.calle}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.calle && !!errors.calle}
              required={metodo === "domicilio"}
              disabled={metodo === "retiro"}
              placeholder="Ej: Los crisantemos, Edificio Norte"
            />
            <Form.Control.Feedback type="invalid">
              {errors.calle}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Departamento (opcional)</Form.Label>
            <Form.Control
              type="text"
              name="departamento"
              placeholder="Ej: 603"
              value={formData.departamento}
              onChange={handleChange}
              disabled={metodo === "retiro"}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Región*</Form.Label>
            <Form.Select
              name="region"
              value={formData.region}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.region && !!errors.region}
              disabled={metodo === "retiro"}
            >
              <option value="Región Metropolitana de Santiago">
                Región Metropolitana de Santiago
              </option>
              <option value="Región de Valparaíso">Región de Valparaíso</option>
              <option value="Región del Biobío">Región del Biobío</option>
              <option value="Región de la Araucanía">Región de la Araucanía</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.region}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Comuna*</Form.Label>
            <Form.Select
              name="comuna"
              value={formData.comuna}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.comuna && !!errors.comuna}
              disabled={metodo === "retiro"}
            >
              <option value="Cerrillos">Cerrillos</option>
              <option value="Santiago">Santiago</option>
              <option value="Providencia">Providencia</option>
              <option value="Las Condes">Las Condes</option>
              <option value="Maipú">Maipú</option>
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
          placeholder="Ej: El martes no estaremos en el depto, pero puede dejárselo con el conserje."
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
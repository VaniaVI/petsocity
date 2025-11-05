"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Row, Col, Table, Form, Button, Card, Alert } from "react-bootstrap";
import { useCart } from "@/hooks/useCart";
import { useFormValidation } from "@/hooks/useFormValidation";
import { clientes } from "@/data/client";
import { fmtCLP } from "@/lib/formatters";
import {
  validateNombre,
  validateCorreo,
  validateMatch,
  validateDireccion,
  validateSelect,
  validateCart,
} from "@/lib/validators";
import { crearCliente } from "@/lib/services/clientService";
import { Link } from "react-bootstrap-icons";

/**
 * Checkout page (App Router)
 * - Vista: 2 columnas (izquierda: formulario + productos, derecha: resumen)
 * - Lógica: useFormValidation + creación de cliente + POST /api/orders
 */

export default function Checkout() {
  const { items, subtotal, envio, total, metodo, setMetodo, clearCart, constants } = useCart("domicilio");
  const router = useRouter();

  // local UI state: mostrar alert de validación después del submit
  const [showValidationAlert, setShowValidationAlert] = useState(false);

  // --- Reglas de validación (centralizadas) ---
  const validationRules = (data, fieldName, fieldValue) => {
    const errors = {};
    const value = fieldValue !== undefined ? fieldValue : data[fieldName];

    if (fieldName) {
      switch (fieldName) {
        case "nombre":
          errors.nombre = validateNombre(value);
          break;
        case "apellidos":
          errors.apellidos = validateNombre(value);
          break;
        case "correo":
          errors.correo = validateCorreo(value);
          break;
        case "verificarCorreo":
          errors.verificarCorreo = validateMatch(data.correo, value, "Los correos");
          break;
        case "calle":
          errors.calle = validateDireccion(value, metodo === "domicilio");
          break;
        case "region":
          errors.region = metodo === "domicilio" ? validateSelect(value, "La región") : "";
          break;
        case "comuna":
          errors.comuna = metodo === "domicilio" ? validateSelect(value, "La comuna") : "";
          break;
      }
      return errors;
    }

    // Validación completa
    errors.nombre = validateNombre(data.nombre);
    errors.apellidos = validateNombre(data.apellidos);
    errors.correo = validateCorreo(data.correo);
    errors.verificarCorreo = validateMatch(data.correo, data.verificarCorreo, "Los correos");

    if (metodo === "domicilio") {
      errors.calle = validateDireccion(data.calle, true);
      errors.region = validateSelect(data.region, "La región");
      errors.comuna = validateSelect(data.comuna, "La comuna");
    }

    errors.cart = validateCart(items);

    // Quitar campos vacíos
    return Object.fromEntries(Object.entries(errors).filter(([_, v]) => v !== ""));
  };

  // --- Hook de validación reutilizable ---
  const {
    formData,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    validateForm,
    touchAllFields,
    setIsSubmitting,
    setErrors,
  } = useFormValidation(
    {
      nombre: "",
      apellidos: "",
      correo: "",
      verificarCorreo: "",
      calle: "",
      departamento: "",
      region: "Región Metropolitana de Santiago",
      comuna: "Cerrillos",
      indicaciones: "",
    },
    validationRules
  );

  // cuando cambio a retiro, limpiar errores de dirección
  useEffect(() => {
    if (metodo === "retiro") {
      setErrors((prev) => ({
        ...prev,
        calle: "",
        region: "",
        comuna: "",
      }));
    }
  }, [metodo, setErrors]);

  // auto-hide del alert de validación
  useEffect(() => {
    if (showValidationAlert) {
      const t = setTimeout(() => setShowValidationAlert(false), 4000);
      return () => clearTimeout(t);
    }
  }, [showValidationAlert]);

  // --- Submit (crea cliente -> crea orden -> limpia carrito -> redirige) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    touchAllFields();

    if (!validateForm()) {
      setShowValidationAlert(true);
      return;
    }

    setIsSubmitting(true);

    try {
      // 1) Crear/obtener cliente (servicio externo)
      const clienteData = {
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        correo: formData.correo,
        direccion: metodo === "domicilio" ? {
          calle: formData.calle,
          departamento: formData.departamento,
          region: formData.region,
          comuna: formData.comuna,
          indicaciones: formData.indicaciones,
        } : null,
      };

      const cliente = await crearCliente(clienteData);
      if (!cliente || !cliente.id) throw new Error("No se pudo crear/obtener cliente");

      // 2) Crear orden
      const orderData = {
        clienteId: cliente.id,
        items: items.map((item) => ({
          id: item.id,
          nombre: item.nombre,
          precio: item.precio,
          quantity: item.quantity,
        })),
        buyer: {
          nombre: formData.nombre,
          apellidos: formData.apellidos,
          correo: formData.correo,
        },
        shipping: {
          metodo,
          direccion: metodo === "domicilio" ? {
            calle: formData.calle,
            departamento: formData.departamento,
            region: formData.region,
            comuna: formData.comuna,
            indicaciones: formData.indicaciones,
          } : null,
        },
        totales: {
          subtotal,
          envio,
          total,
        },
        fecha: new Date().toISOString(),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      // mostrar error real si la API falla
      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Error en API /api/orders:", errorText);
        throw new Error("No se pudo confirmar la orden");
      }

      const result = await res.json();
      if (!result.orderId) throw new Error("orderId no recibido desde la API");

      // 3) Limpiar carrito y redirigir
      clearCart();
      router.push(`/compraExitosa?orderId=${result.orderId}`);

    } catch (error) {
      console.error("❌ Error en la compra:", error);
      // Mensaje amigable al usuario
      alert("Hubo un problema confirmando la compra. Por favor intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Si el carrito está vacío — vista simplificada
  if (!items || items.length === 0) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <h1 className="mb-4">Carrito de compra</h1>
          <div className="alert alert-info mx-auto" style={{ maxWidth: "500px" }}>
            Tu carrito está vacío
          </div>
          <Link href="/products" className="btn btn-primary mt-3">Ver productos</Link>
        </div>
      </Container>
    );
  }

  // ---------- RENDER (mantiene tu vista A: formulario a la izquierda, resumen a la derecha) ----------
  return (
    <Container className="py-4">
      <Row>
        {/* IZQUIERDA: Formulario + tabla de productos */}
        <Col lg={8}>
          <h2 className="h4 mb-3">Carrito de compra</h2>
          <p className="text-muted small mb-4">Completa la siguiente información</p>

          {/* Tabla de productos */}
          <div className="table-responsive mb-4">
            <Table hover className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th className="text-center">Cantidad</th>
                  <th className="text-end">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td style={{ width: "80px" }}>
                      {item.img ? (
                        <img
                          src={item.img}
                          alt={item.nombre}
                          className="img-fluid rounded"
                          style={{ width: "60px", height: "60px", objectFit: "cover" }}
                        />
                      ) : (
                        <div className="bg-secondary rounded" style={{ width: "60px", height: "60px" }} />
                      )}
                    </td>
                    <td>{item.nombre}</td>
                    <td>{fmtCLP(item.precio)}</td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-end fw-semibold">{fmtCLP(item.precio * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {/* Formulario */}
          <Form onSubmit={handleSubmit} noValidate>
            {/* alerta de validación (aparece solo después de intentar enviar) */}
            {showValidationAlert && (
              <Alert variant="danger" onClose={() => setShowValidationAlert(false)} dismissible>
                <Alert.Heading>¡Ups! Ha ocurrido un error</Alert.Heading>
                <p>Por favor corrige los errores en el formulario antes de continuar.</p>
              </Alert>
            )}

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
                  <Form.Control.Feedback type="invalid">{errors.nombre}</Form.Control.Feedback>
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
                  <Form.Control.Feedback type="invalid">{errors.apellidos}</Form.Control.Feedback>
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
                  <Form.Control.Feedback type="invalid">{errors.correo}</Form.Control.Feedback>
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
                  <Form.Control.Feedback type="invalid">{errors.verificarCorreo}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            {/* Dirección */}
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
                  <Form.Control.Feedback type="invalid">{errors.calle}</Form.Control.Feedback>
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
                    <option value="Región Metropolitana de Santiago">Región Metropolitana de Santiago</option>
                    <option value="Región de Valparaíso">Región de Valparaíso</option>
                    <option value="Región del Biobío">Región del Biobío</option>
                    <option value="Región de la Araucanía">Región de la Araucanía</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.region}</Form.Control.Feedback>
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
                  <Form.Control.Feedback type="invalid">{errors.comuna}</Form.Control.Feedback>
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

            <div className="d-grid mb-4">
              <Button variant="success" size="lg" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Procesando..." : `Pagar ahora ${fmtCLP(total)}`}
              </Button>
            </div>
          </Form>
        </Col>

        {/* DERECHA: Resumen y método de entrega */}
        <Col lg={4}>
          <Card className="sticky-top" style={{ top: "20px" }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Total a pagar:</h5>
                <h4 className="text-primary mb-0">{fmtCLP(total)}</h4>
              </div>

              <hr />

              {/* Método de entrega */}
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold small">Método de entrega</Form.Label>
                <Form.Select value={metodo} onChange={(e) => setMetodo(e.target.value)} size="sm">
                  <option value="domicilio">
                    Despacho a domicilio
                    {subtotal >= constants.ENVIO_GRATIS_MINIMO ? " (gratis)" : ` (+${fmtCLP(constants.COSTO_ENVIO_BASE)})`}
                  </option>
                  <option value="retiro">Retiro en tienda (sin costo)</option>
                </Form.Select>
              </Form.Group>

              {/* Desglose de totales */}
              <div className="small">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Subtotal</span>
                  <span>{fmtCLP(subtotal)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Envío</span>
                  <span>{envio === 0 ? "Gratis" : fmtCLP(envio)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <strong>Total</strong>
                  <strong className="text-primary">{fmtCLP(total)}</strong>
                </div>
              </div>

              {/* Mensaje de envío gratis */}
              {metodo === "domicilio" && envio === 0 && subtotal >= constants.ENVIO_GRATIS_MINIMO && (
                <div className="alert alert-success mt-3 py-2 px-3 small mb-0">¡Envío gratis aplicado!</div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

// app/checkout/page.jsx
"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Alert, ListGroup, Badge } from "react-bootstrap";
import CheckoutForm from "@/components/CheckoutForm";
import { getClienteId } from "@/lib/services/clientService";
import { procesarCheckout } from "@/lib/services/checkoutService";
import { useCart } from "@/hooks/useCart";
import { fmtCLP } from "@/lib/formatters";
import {
  validateNombre,
  validateCorreo,
  validateMatch,
  validateSelect,
} from "@/lib/validators";

export default function CheckoutPage() {
  // ============================================
  // ESTADO DEL FORMULARIO
  // ============================================
  // Inicializar formData
const [formData, setFormData] = useState({
  nombre: "",
  apellido: "",
  correo: "",
  verificarCorreo: "",
  calle: "",
  departamento: "",
  region: "",
  comuna: "",
  indicaciones: "",
});


  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [metodo, setMetodo] = useState("retiro");
  const [showValidationAlert, setShowValidationAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter()
  const { items: carro, clearCart } = useCart();
  


  // ============================================
  // CARRITO DE COMPRAS CON useCart
  // ============================================
  const {
    items: carrito,
    subtotal,
    envio,
    total,
    itemCount: cantidadProductos,
    setMetodo: setMetodoCarrito,
  } = useCart(metodo);

  // Sincronizar método de envío con el hook del carrito
  useEffect(() => {
    if (setMetodoCarrito) {
      setMetodoCarrito(metodo);
    }
  }, [metodo, setMetodoCarrito]);

  // ============================================
  // CARGAR DATOS DEL CLIENTE AL MONTAR
  // ============================================
useEffect(() => {
  const cargarDatosCliente = async () => {
    const idCliente = getClienteId();
    if (!idCliente) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`https://petsocitymicroservicio-production.up.railway.app/api/v1/usuarios/${idCliente}`);
      
      if (res.status === 404) {
        setFormData({
          nombre: "",
          apellidos: "",
          correo: "",
          verificarCorreo: "",
          calle: "",
          departamento: "",
          region: "",
          comuna: "",
          indicaciones: "",
        });
        return;
      }

      if (!res.ok) throw new Error(`Error al cargar usuario: ${res.statusText}`);

      const data = await res.json();

      setFormData({
        nombre: data.nombre || "",
        apellidos: data.apellido || "",
        correo: data.email || "",
        verificarCorreo: data.email || "",
        calle: data.direccion || "",
        departamento: data.departamento || "",
        region: data.regionCodigo || "",
        comuna: data.comunaCodigo || "",
        indicaciones: data.indicaciones || "",
      });

    } catch (error) {
      console.error("Error cargando usuario:", error);
    } finally {
      setIsLoading(false);
    }
  };

  cargarDatosCliente();
}, []);



  // ============================================
  // FUNCIONES DE VALIDACIÓN
  // ============================================
  const validationRules = (data, fieldName, fieldValue) => {
    const errors = {};
    const value = fieldValue !== undefined ? fieldValue : data[fieldName];

    if (fieldName) {
      switch (fieldName) {
        case "nombre":
          errors.nombre = validateNombre(value);
          break;
        case "apellido":
          errors.apellido = validateNombre(value);
          break;
        case "correo":
          errors.correo = validateCorreo(value);
          break;
        case "verificarCorreo":
          errors.verificarCorreo = validateMatch(
            data.correo,
            value,
            "Los correos"
          );
          break;
        case "calle":
          if (metodo === "domicilio" && !value.trim()) {
            errors.calle = "La dirección es obligatoria para envío a domicilio";
          }
          break;
        case "region":
        case "comuna":
          if (metodo === "domicilio") {
            errors[fieldName] = validateSelect(
              value,
              fieldName === "region" ? "La región" : "La comuna"
            );
          }
          break;
      }
      return errors;
    }

    // Validar todo el formulario
    errors.nombre = validateNombre(data.nombre);
    errors.apellido = validateNombre(data.apellido);
    errors.correo = validateCorreo(data.correo);
    errors.verificarCorreo = validateMatch(
      data.correo,
      data.verificarCorreo,
      "Los correos"
    );

    if (metodo === "domicilio") {
      if (!data.calle.trim()) {
        errors.calle = "La dirección es obligatoria para envío a domicilio";
      }
      errors.region = validateSelect(data.region, "La región");
      errors.comuna = validateSelect(data.comuna, "La comuna");
    }

    return Object.fromEntries(
      Object.entries(errors).filter(([_, v]) => v !== "")
    );
  };

  // ============================================
  // MANEJO DE CAMBIOS
  // ============================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validación en tiempo real si ya fue tocado
    if (touched[name]) {
      const fieldErrors = validationRules(
        { ...formData, [name]: value },
        name,
        value
      );
      setErrors((prev) => ({
        ...prev,
        ...fieldErrors,
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const fieldErrors = validationRules(formData, name, formData[name]);
    setErrors((prev) => ({
      ...prev,
      ...fieldErrors,
    }));
  };

  // ============================================
  // VALIDAR TODO EL FORMULARIO
  // ============================================
  const validateForm = () => {
    const newErrors = validationRules(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const touchAllFields = () => {
    const allTouched = {};
    Object.keys(formData).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
  };

  // ============================================
  // MANEJO DEL SUBMIT
  // ============================================
   const handleSubmit = async (e) => {
    e.preventDefault();

    if (carrito.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    try {
      const resultado = await procesarCheckout(formData, carro);

      if (resultado.exito) {
        router.push(`/compraExitosa?orderId=${resultado.orden.id}`);
        clearCart();
      } else {
        alert("❌ " + resultado.mensaje);
      }
    } catch (error) {
      console.error("Error en checkout:", error);
      alert("Hubo un problema al procesar tu compra.");
    }
  };

  // ============================================
  // LOADING STATE
  // ============================================
  if (isLoading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando información...</p>
        </div>
      </Container>
    );
  }

  // ============================================
  // RENDERIZADO PRINCIPAL
  // ============================================
  return (
    <Container className="py-4">
      <h1 className="mb-4">Finalizar Compra</h1>

      {/* Alert de validación */}
      {showValidationAlert && (
        <Alert
          variant="danger"
          dismissible
          onClose={() => setShowValidationAlert(false)}
          className="mb-4"
        >
          <Alert.Heading>¡Ups! Ha ocurrido un error</Alert.Heading>
          <p>Por favor corrige los errores en el formulario antes de continuar.</p>
        </Alert>
      )}

      {/* Validar carrito vacío */}
      {carrito.length === 0 && (
        <Alert variant="warning">
          <Alert.Heading>Carrito vacío</Alert.Heading>
          <p>No tienes productos en tu carrito. Agrega algunos antes de finalizar la compra.</p>
        </Alert>
      )}

      <Row>
        {/* COLUMNA IZQUIERDA: FORMULARIO */}
        <Col lg={7}>
          <Card className="shadow-sm border-0 mb-4">
            <Card.Body className="p-4">
              <CheckoutForm
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                touched={touched}
                metodo={metodo}
                setMetodo={setMetodo}
                handleChange={handleChange}
                handleBlur={handleBlur}
                handleSubmit={handleSubmit}
                total={total}
              />
            </Card.Body>
          </Card>
        </Col>

        {/* COLUMNA DERECHA: RESUMEN */}
        <Col lg={5}>
          <Card className="shadow-sm border-0 sticky-top" style={{ top: "20px" }}>
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Resumen de la compra</h5>
            </Card.Header>
            <Card.Body>
              {/* Lista de productos */}
              <ListGroup variant="flush" className="mb-3">
                {carrito.map((item) => (
                  <ListGroup.Item
                    key={item.id}
                    className="d-flex justify-content-between align-items-start px-0"
                  >
                    <div className="d-flex gap-3 flex-grow-1">
                      {item.imagen && (
                        <img
                          src={item.imagen}
                          alt={item.nombre}
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                      )}
                      <div className="flex-grow-1">
                        <div className="fw-bold">{item.nombre}</div>
                        <small className="text-muted">
                          {fmtCLP(item.precio)} x {item.quantity}
                        </small>
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold">
                        {fmtCLP(item.precio * item.quantity)}
                      </div>
                      <Badge bg="secondary">{item.quantity} ud.</Badge>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>

              {/* Totales */}
              <hr />
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal ({cantidadProductos} productos)</span>
                <span className="fw-bold">{fmtCLP(subtotal)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Envío</span>
                <span className="text-success">
                  {fmtCLP(envio)}
                </span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <h5 className="mb-0">Total</h5>
                <h5 className="mb-0 text-primary">
                  {fmtCLP(total)}
                </h5>
              </div>

              {/* Información adicional */}
              <div className="bg-light p-3 rounded">
                <small className="text-muted">
                  <strong>📦 Método de entrega:</strong>{" "}
                  {metodo === "domicilio" ? "Envío a domicilio" : "Retiro en tienda"}
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
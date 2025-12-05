"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Container , Row , Col , Button , Form , Breadcrumb , Card , Spinner , Alert} from "react-bootstrap";
import Link from "next/link";
import { useCart } from "@/hooks/useCart.js";
import { fmtCLP } from "@/lib/formatters";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-producto-production.up.railway.app";

// Adaptador: pasa del JSON del backend al formato que usa el front
function mapApiProduct(apiProd) {

  const id = apiProd.idProducto;
  
  return {
    id: apiProd.idProducto,           
    nombre: apiProd.nombre,
    descripcion: apiProd.descripcion,
    precio: Number(apiProd.precio),
    categoria: apiProd.categoria?.nombre ?? "",
    imagen: `/productos/perro${id}.png`,
    etiquetas: [],
    // stock lo agregamos después (cuando llamemos al microservicio de inventario)
  };
}

export default function DetalleProducto() {
  const { id } = useParams(); // viene como string desde la URL
  const [producto, setProducto] = useState(null);
  const [relacionados, setRelacionados] = useState([]);
  const [cantidad, setCantidad] = useState(1);
  const [cantidadAgregada, setCantidadAgregada] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  // Obtener addItem y constants del hook useCart
  const { addItem, constants } = useCart();

  // Cargar producto, stock e relacionados
  useEffect(() => {
    if (!id || !API_URL) return;

    const fetchProducto = async () => {
      setLoading(true);
      try {
        // 1) Obtener producto desde el microservicio
        const res = await fetch(`${API_URL}/api/v1/productos/${id}`, {
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Error al cargar producto");
        const apiProd = await res.json();

        // Adaptamos el producto al formato del front
        let mapped = mapApiProduct(apiProd);

        // 2) Obtener stock desde el microservicio de inventario
        try {
          const resInv = await fetch(
            `${API_URL}/api/v1/inventarios/producto/${id}`,
            { cache: "no-store" }
          );

          if (resInv.ok) {
            const inv = await resInv.json();
            mapped = {
              ...mapped,
              stock: inv.stockActual, // ahora producto.stock existe
            };
          }
        } catch (errorInv) {
          console.error("Error cargando inventario:", errorInv);
        }

        setProducto(mapped);

        // 3) Cargar productos relacionados por categoria 
        const idCategoria = apiProd.categoria?.idCategoria;
        if (idCategoria) {
          const resRel = await fetch(
            `${API_URL}/api/v1/productos/categoria/${idCategoria}`,
            { cache: "no-store" }
          );
          if (resRel.ok) {
            const relApi = await resRel.json();
            const relMapped = relApi
              .map(mapApiProduct)
              .filter((p) => p.id !== mapped.id) // no incluir el mismo
              .slice(0, 3);

            setRelacionados(relMapped);
          }
        }
      } catch (error) {
        console.error("Error cargando producto:", error);
        setProducto(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [id]);

  // validación 
  const handleCantidadChange = (e) => {
    const val = Number(e.target.value);
    if (val >= 1 && val <= constants.MAX_PER_ITEM) {
      setCantidad(val);
    } else if (val < 1) {
      setCantidad(1);
    } else {
      setCantidad(constants.MAX_PER_ITEM);
    }
  };

  const incrementarCantidad = () => {
    if (cantidad < constants.MAX_PER_ITEM) {
      setCantidad(cantidad + 1);
    }
  };

  const decrementarCantidad = () => {
    if (cantidad > 1) {
      setCantidad(cantidad - 1);
    }
  };

  const handleAgregarCarrito = () => {
    if (!producto) return;

    const cant = Math.max(
      1,
      Math.min(constants.MAX_PER_ITEM, Number(cantidad) || 1)
    );

    addItem(
      {
        id: producto.id, // usamos el id ya adaptado
        nombre: producto.nombre,
        precio: Number(producto.precio) || 0,
        img: producto.imagen ?? null,
      },
      cant
    );

    setCantidadAgregada(cant);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    setCantidad(1);
  };

  // Estado de carga
  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando producto...</p>
      </Container>
    );
  }

  // Producto no encontrado
  if (!producto) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="warning">
          <Alert.Heading>Producto no encontrado</Alert.Heading>
          <p>El producto que buscas no existe o fue eliminado.</p>
          <Link href="/products" passHref>
            <Button variant="primary">Ver todos los productos</Button>
          </Link>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      {/* Alerta de éxito */}
      {showSuccess && (
        <Alert
          variant="success"
          dismissible
          onClose={() => setShowSuccess(false)}
          className="mb-4"
        >
          <Alert.Heading>¡Producto agregado!</Alert.Heading>
          <p className="mb-0">
            Se agregó {cantidadAgregada}{" "}
            {cantidadAgregada === 1 ? "unidad" : "unidades"} de{" "}
            <strong>{producto.nombre}</strong> al carrito.
          </p>
        </Alert>
      )}

      {/* Breadcrumb */}
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item linkAs={Link} href="/">
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} href="/products">
          Productos
        </Breadcrumb.Item>
        {producto.categoria && (
          <Breadcrumb.Item active>{producto.categoria}</Breadcrumb.Item>
        )}
        <Breadcrumb.Item active>{producto.nombre}</Breadcrumb.Item>
      </Breadcrumb>

      {/* Detalle del producto */}
      <Row className="g-4 align-items-start mb-5">
        {/* Columna izquierda: Imagen */}
        <Col md={6}>
          <Card className="shadow-sm border-0">
            <Card.Img
              variant="top"
              src={producto.imagen || "/placeholder.jpg"}
              alt={producto.nombre}
              style={{ objectFit: "cover", maxHeight: "500px", width: "100%" }}
            />
          </Card>
        </Col>

        {/* Columna derecha: Información */}
        <Col md={6}>
          <h1 className="h3 mb-3 fw-bold">{producto.nombre}</h1>

          <div className="mb-3">
            <span className="h4 text-success fw-bold">
              {fmtCLP(producto.precio)}
            </span>
          </div>

          {producto.descripcion && (
            <p className="text-muted mb-4">{producto.descripcion}</p>
          )}

          {/* Stock disponible */}
          {typeof producto.stock === "number" && (
            <div className="mb-3">
              {producto.stock > 0 ? (
                <span className="badge bg-success">
                  ✓ Stock disponible: {producto.stock} unidades
                </span>
              ) : (
                <span className="badge bg-danger">
                  ✕ Sin stock disponible
                </span>
              )}
            </div>
          )}

          {/* Selector de cantidad */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-bold">Cantidad:</Form.Label>
            <div className="d-flex align-items-center gap-2">
              <div className="btn-group" role="group">
                <Button
                  variant="outline-secondary"
                  onClick={decrementarCantidad}
                  disabled={cantidad <= 1}
                  aria-label="Disminuir cantidad"
                >
                  −
                </Button>
                <Form.Control
                  type="number"
                  min="1"
                  max={constants.MAX_PER_ITEM}
                  value={cantidad}
                  onChange={handleCantidadChange}
                  style={{ width: "50px", textAlign: "center" }}
                  className="border-secondary"
                />
                <Button
                  variant="outline-secondary"
                  onClick={incrementarCantidad}
                  disabled={cantidad >= constants.MAX_PER_ITEM}
                  aria-label="Aumentar cantidad"
                >
                  +
                </Button>
              </div>
              <small className="text-muted">
                Máximo {constants.MAX_PER_ITEM} unidades
              </small>
            </div>
          </Form.Group>

          {/* Botones de acción */}
          <div className="d-grid gap-2 mb-3">
            <Button variant="primary" size="lg" onClick={handleAgregarCarrito}>
              Añadir al carrito
            </Button>

            <Link href="/carrito" passHref>
              <Button variant="outline-secondary" size="lg">
                Ver carrito
              </Button>
            </Link>
          </div>

          {/* Información adicional */}
          <div className="border-top pt-3 mt-4">
            <h6 className="fw-bold mb-3">Información adicional</h6>
            <ul className="list-unstyled small text-muted">
              <li className="mb-2">
                ✓ Envío gratis sobre {fmtCLP(constants.ENVIO_GRATIS_MINIMO)}
              </li>
              <li className="mb-2">✓ Retiro en tienda disponible</li>
              <li className="mb-2">✓ Garantía de 30 días</li>
              <li className="mb-2">✓ Pago seguro</li>
            </ul>
          </div>
        </Col>
      </Row>

      {/* Productos relacionados */}
      {relacionados.length > 0 && (
        <>
          <h3 className="mb-4">Productos relacionados</h3>
          <Row className="g-4">
            {relacionados.map((rel) => (
              <Col key={rel.id} xs={12} sm={6} lg={4}>
                <Card className="h-100 shadow-sm hover-shadow">
                  <Card.Img
                    variant="top"
                    src={rel.imagen || "/placeholder.jpg"}
                    alt={rel.nombre}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title
                      className="text-truncate"
                      title={rel.nombre}
                    >
                      {rel.nombre}
                    </Card.Title>
                    <Card.Text className="text-success fw-bold">
                      {fmtCLP(rel.precio)}
                    </Card.Text>
                    <div className="mt-auto">
                      <Link href={`/products/${rel.id}`} passHref>
                        <Button variant="outline-primary" size="sm">
                          Ver detalle
                        </Button>
                      </Link>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </Container>
  );
}
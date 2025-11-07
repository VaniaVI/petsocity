import {  CheckCircleFill, XCircleFill } from "react-bootstrap-icons";
import {  Card } from "react-bootstrap";

//Header de vista compraExitosa. esta depende de si el pago fue realizado con exito o hubo un fallo
export  function HeaderCompra({ exito, orderId }) {
  return (
    <Card className={`mb-4 border-${exito ? "success" : "danger"}`}>
      <Card.Body className="text-center py-5">
        {exito ? (
          <CheckCircleFill className="text-success mb-3" size={60} />
        ) : (
          <XCircleFill className="text-danger mb-3" size={60} />
        )}
        <h1 className="mb-2">
          {exito
            ? `Se ha realizado la compra. nro #${orderId}`
            : "No se pudo realizar el pago"}
        </h1>
        {exito && (
          <>
            <p className="text-muted mb-0">
              Código orden: <strong>ORDER{orderId}</strong>
            </p>
            <p className="text-muted small">Completa la siguiente información</p>
          </>
        )}
      </Card.Body>
    </Card>
  );
}
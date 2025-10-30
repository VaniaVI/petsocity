'use client'
import { useEffect, useRef } from "react";

export default function LoginModal({ show, onClose }) {
  const modalRef = useRef(null);
  const modalInstanceRef = useRef(null);

  useEffect(() => {
    // Importar Bootstrap solo en el cliente
    const initializeModal = async () => {
      const { Modal } = await import('bootstrap');
      
      if (modalRef.current) {
        modalInstanceRef.current = new Modal(modalRef.current);
        
        // Manejar el evento cuando el modal se cierra
        const handleHidden = () => {
          onClose();
        };

        modalRef.current.addEventListener('hidden.bs.modal', handleHidden);

        return () => {
          if (modalRef.current) {
            modalRef.current.removeEventListener('hidden.bs.modal', handleHidden);
          }
        };
      }
    };

    initializeModal();

    // Limpieza al desmontar
    return () => {
      if (modalInstanceRef.current) {
        modalInstanceRef.current.dispose();
      }
    };
  }, [onClose]);

  useEffect(() => {
    if (modalInstanceRef.current) {
      if (show) {
        modalInstanceRef.current.show();
      } else {
        modalInstanceRef.current.hide();
      }
    }
  }, [show]);

  return (
    <div
      className="modal fade"
      id="loginModal"
      tabIndex="-1"
      aria-labelledby="loginModalLabel"
      aria-hidden="true"
      ref={modalRef}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="loginModalLabel">
              Iniciar sesión
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Correo</label>
                <input type="email" className="form-control" id="email" placeholder="ejemplo@email.com" />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Contraseña</label>
                <input type="password" className="form-control" id="password" />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Entrar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';
import { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { getClienteNombre, getClienteCorreo, clearClienteData } from '@/lib/services/clientService';

export default function UserSessionModal({ show, handleClose, onLogout }) {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');

  useEffect(() => {
    if (show) { // Solo actualizar cuando el modal se abre
      setNombre(getClienteNombre() || '');
      setCorreo(getClienteCorreo() || '');
    }
  }, [show]);

  const handleLogout = () => {
    clearClienteData();
    if (onLogout) onLogout();
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Mi sesión</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>Nombre:</strong> {nombre}</p>
        <p><strong>Correo:</strong> {correo}</p>

        <Button variant="danger" onClick={handleLogout} className="w-100 mt-3">
          Cerrar sesión
        </Button>
      </Modal.Body>
    </Modal>
  );
}

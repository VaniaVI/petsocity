'use client';
import { Modal, Button, Form } from 'react-bootstrap';
import { useState } from 'react';
import  Link  from 'next/link';

export default function LoginModal({ show, handleClose }) {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Iniciar sesión</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control type="email" placeholder="Ingresa tu correo" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control type="password" placeholder="Contraseña" />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Iniciar sesión
          </Button>
        
          <Form.Text className='text-muted d-flex flex-column align-item-center text-center mt-3'>
            <Link href="../" className="me-3 text-decoration-none">¿Olvidaste tu contraseña?</Link>
            <Link href="../registrarUsuario" className="me-3 text-decoration-none">¿No tienes cuenta? Registrate</Link>
          </Form.Text>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

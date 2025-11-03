'use client';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useState } from 'react';
import Link from 'next/link';

export default function LoginModal({ show, handleClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState(false);
  const [message, setMessage] = useState(null); //  mensaje de éxito o error
  const [variant, setVariant] = useState('success'); //  tipo de alerta

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};

    // Validación de email
    if (!email) {
      newErrors.email = 'El correo es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'El correo no tiene un formato válido';
    }

    // Validación de contraseña
    if (!password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    setErrors(newErrors);
    setValidated(true);

    if (Object.keys(newErrors).length === 0) {
      // Aquí iría la lógica real de login (API, auth, etc.)
      console.log('Login exitoso con:', { email, password });

      // Mostrar mensaje de éxito
      setMessage('Inicio de sesión exitoso, bienvenido 👋');
      setVariant('success');

      // Limpiar campos
      setEmail('');
      setPassword('');

      // Cerrar modal después de un tiempo (opcional)
      setTimeout(() => {
        setMessage(null);
        handleClose();
      }, 2000);
    } else {
      setMessage('Revisa los campos e inténtalo de nuevo.');
      setVariant('danger');
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Iniciar sesión</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message && <Alert variant={variant}>{message}</Alert>}

        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control
              type="email"
              placeholder="Ingresa tu correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={!!errors.password}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Iniciar sesión
          </Button>

          <Form.Text className="text-muted d-flex flex-column align-item-center text-center mt-3">
            <Link href="../recuperarPassword" className="me-3 text-decoration-none">
              ¿Olvidaste tu contraseña?
            </Link>
            <Link href="../registrarUsuario" className="me-3 text-decoration-none">
              ¿No tienes cuenta? Regístrate
            </Link>
          </Form.Text>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
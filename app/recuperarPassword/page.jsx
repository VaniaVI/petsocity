'use client';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { useState } from 'react';

export default function RecuperarPassword() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    // Validación de email
    if (!email) {
      newErrors.email = 'El correo es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'El correo no tiene un formato válido';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Simulación de llamada a API
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      // ✅ Siempre mostrar éxito, independiente de la respuesta real
      setMessage(
        'Si el correo está registrado, te hemos enviado un mensaje con instrucciones. Revisa tu bandeja de entrada o spam.'
      );

      // Limpiar campo
      setEmail('');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-5">
      <Card style={{ width: '28rem' }} className="shadow-sm p-4">
        <Card.Body>
          <Card.Title className="mb-3 text-center">Recuperar contraseña</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingresa tu correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isInvalid={!!errors.email}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>
            <Button type="submit" className="w-100">
              Enviar instrucciones
            </Button>
          </Form>
          {message && <Alert variant="success" className="mt-3">{message}</Alert>}
        </Card.Body>
      </Card>
    </div>
  );
}
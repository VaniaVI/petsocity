'use client';
import { Modal, Button, Form, Alert, InputGroup } from 'react-bootstrap';
import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { setClienteNombre, setClienteCorreo, setClienteId } from '@/lib/services/clientService';


export default function LoginModal({ show, handleClose, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [variant, setVariant] = useState('success');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'El correo es obligatorio';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Formato de correo inválido';

    if (!contrasenia) newErrors.contrasenia = 'La contraseña es obligatoria';
    else if (contrasenia.length < 8) newErrors.contrasenia = 'La contraseña debe tener al menos 8 caracteres';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setMessage('Revisa los campos e inténtalo de nuevo.');
      setVariant('danger');
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('https://petsocitymicroservicio-production.up.railway.app/api/v1/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, contrasenia })
      });

      if (response.ok) {
        const usuario = await response.json();
        setClienteNombre(usuario.nombre);
        setClienteCorreo(usuario.correo);
        setClienteId(usuario.id);
        setMessage(`¡Bienvenido, ${usuario.nombre}!`);
        setVariant('success');
        setEmail('');
        setContrasenia('');
        if (onLoginSuccess) onLoginSuccess(usuario);
        setTimeout(() => {
          setMessage(null);
          handleClose();
        }, 1500);
      } else {
        const errorData = await response.json();
        setMessage(errorData.mensaje || 'Correo o contraseña incorrectos');
        setVariant('danger');
      }
    } catch (error) {
      console.error(error);
      setMessage('Error al conectar con el servidor');
      setVariant('danger');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Iniciar sesión</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message && <Alert variant={variant}>{message}</Alert>}
        <Form noValidate onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control
              type="email"
              placeholder="Ingresa tu correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
          </Form.Group>

        <Form.Group className="mb-3" controlId="formContrasenia">
  <Form.Label>Contraseña</Form.Label>

  <InputGroup>
    <Form.Control
      type={showPassword ? "text" : "password"}
      placeholder="Contraseña"
      value={contrasenia}
      onChange={(e) => setContrasenia(e.target.value)}
      isInvalid={!!errors.contrasenia}
    />

    <Button
      variant="outline-secondary"
      type="button"
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? <EyeSlash /> : <Eye />}
    </Button>
  </InputGroup>

  <Form.Control.Feedback type="invalid">
    {errors.contrasenia}
  </Form.Control.Feedback>
</Form.Group>


          <Button variant="primary" type="submit" className="w-100" disabled={isSubmitting}>
            {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </Button>

          <Form.Text className="text-muted d-flex flex-column align-items-center text-center mt-3">
            <Link href="../recuperarPassword" className="text-decoration-none mb-1">
              ¿Olvidaste tu contraseña?
            </Link>
            <Link href="../registrarUsuario" className="text-decoration-none">
              ¿No tienes cuenta? Regístrate
            </Link>
          </Form.Text>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

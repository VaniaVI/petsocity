'use client';

import { useState } from 'react';

export default function ContactoPage() {
  const [form, setForm] = useState({ nombre: '', email: '', asunto: '', mensaje: '' });
  const [enviado, setEnviado] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    if (Object.values(form).some(v => v.trim() === '')) return alert('Completa todos los campos');
    setEnviado(true);
    setTimeout(() => setEnviado(false), 4000);
    setForm({ nombre: '', email: '', asunto: '', mensaje: '' });
  };

  return (
    <main className="container py-5">
      <section className="row justify-content-center">
        <div className="col-12 col-md-8">
          <h1 className="display-6 fw-semibold text-center mb-4">Contáctanos</h1>
          <p className="text-center mb-5">
            ¿Tienes dudas o sugerencias? Escríbenos y te responderemos lo antes posible.
          </p>

          {enviado && (
            <div className="alert alert-success text-center">
              ¡Tu mensaje ha sido enviado con éxito!
            </div>
          )}

          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-md-6">
              <label className="form-label">Nombre</label>
              <input name="nombre" className="form-control" value={form.nombre} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Correo electrónico</label>
              <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} required />
            </div>
            <div className="col-12">
              <label className="form-label">Asunto</label>
              <input name="asunto" className="form-control" value={form.asunto} onChange={handleChange} required />
            </div>
            <div className="col-12">
              <label className="form-label">Mensaje</label>
              <textarea name="mensaje" rows="4" className="form-control" value={form.mensaje} onChange={handleChange} required />
            </div>
            <div className="col-12 text-center">
              <button type="submit" className="btn btn-primary px-4">Enviar mensaje</button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

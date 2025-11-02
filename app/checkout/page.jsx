'use client';
import { useState } from 'react';
import { totals, clearCart } from '../../hooks/shoppingCart';
import Notify from '../../components/Notify';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const [form, setForm] = useState({ nombre: '', email: '', direccion: '', comuna: '', metodo: 'domicilio' });
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '' });
  const router = useRouter();

  const t = totals(form.metodo);

  const submit = async (e) => {
    e.preventDefault();
    if (!t.items.length) return alert('Tu carrito está vacío');
    if (!form.nombre || !form.email) return alert('Completa nombre y email');

    setSending(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: t.items, buyer: form, metodo: form.metodo, total: t.total }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'No se pudo confirmar');

      clearCart();
      setToast({ show: true, msg: `Orden ${data.orderId} confirmada. Te enviamos el detalle al correo.` });
      setTimeout(() => router.push('/compra-exitosa'), 1500);
    } catch (err) {
      alert(err.message || 'Error al confirmar la compra');
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="container py-5">
      <Notify show={toast.show} message={toast.msg} onHide={() => setToast({ show: false, msg: '' })} />
      <h1 className="mb-3">Checkout</h1>

      {!t.items.length ? (
        <div className="alert alert-warning">Tu carrito está vacío.</div>
      ) : (
        <div className="alert alert-secondary d-flex justify-content-between">
          <span><strong>Items:</strong> {t.totalItems} · <strong>Envío:</strong> ${t.envio.toLocaleString('es-CL')}</span>
          <span><strong>Total:</strong> ${t.total.toLocaleString('es-CL')}</span>
        </div>
      )}

      <form className="row g-3" onSubmit={submit}>
        <div className="col-md-6">
          <label className="form-label">Nombre</label>
          <input className="form-control" value={form.nombre} onChange={(e)=>setForm({...form, nombre:e.target.value})} required />
        </div>
        <div className="col-md-6">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} required />
        </div>
        <div className="col-md-8">
          <label className="form-label">Dirección</label>
          <input className="form-control" value={form.direccion} onChange={(e)=>setForm({...form, direccion:e.target.value})} disabled={form.metodo==='retiro'} required={form.metodo==='domicilio'} />
        </div>
        <div className="col-md-4">
          <label className="form-label">Comuna</label>
          <input className="form-control" value={form.comuna} onChange={(e)=>setForm({...form, comuna:e.target.value})} disabled={form.metodo==='retiro'} required={form.metodo==='domicilio'} />
        </div>
        <div className="col-md-4">
          <label className="form-label">Método de entrega</label>
          <select className="form-select" value={form.metodo} onChange={(e)=>setForm({...form, metodo:e.target.value})}>
            <option value="domicilio">Despacho a domicilio</option>
            <option value="retiro">Retiro en tienda</option>
          </select>
        </div>
        <div className="col-12 d-flex gap-2">
          <button type="submit" className="btn btn-success" disabled={!t.items.length || sending}>
            {sending ? 'Confirmando…' : 'Confirmar compra'}
          </button>
          <a href="/carrito" className="btn btn-outline-secondary">Volver al carrito</a>
        </div>
      </form>
    </main>
  );
}

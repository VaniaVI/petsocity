export async function POST(req) {
  try {
    const body = await req.json();
    const { items, buyer } = body || {};

    if (!Array.isArray(items) || !items.length) {
      return new Response(JSON.stringify({ error: 'Carrito vacío' }), { status: 400 });
    }
    if (!buyer?.nombre || !buyer?.email) {
      return new Response(JSON.stringify({ error: 'Datos de comprador incompletos' }), { status: 400 });
    }

    const orderId = 'ORD-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    return new Response(JSON.stringify({ ok: true, orderId }), { status: 201 });
  } catch {
    return new Response(JSON.stringify({ error: 'Error procesando la orden' }), { status: 500 });
  }
}

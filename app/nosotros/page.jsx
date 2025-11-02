'use client';

export default function NosotrosPage() {
  return (
    <main className="container py-5">
      {/* HERO breve */}
      <section className="row align-items-center g-4 mb-5">
        <div className="col-12 col-lg-7">
          <h1 className="display-6 fw-semibold">Sobre PetSocity</h1>
          <p className="mt-2">
            Las familias buscan facilidad y confianza al comprar productos para sus mascotas.
            PetSocity simplifica la compra y ofrece una experiencia clara y cercana.
          </p>
        </div>
        <div className="col-12 col-lg-5 text-center">
          {/* Usa tu imagen existente si la tienes en /public */}
          <img
            src="/image/logoPetsocity.png"
            alt="PetSocity"
            className="img-fluid rounded shadow-sm"
          />
        </div>
      </section>

      {/* MISIÓN / VISIÓN (texto tomado de la primera versión) */}
      <section className="row g-4 mb-5">
        <div className="col-12 col-md-6">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <h2 className="h5 fw-semibold mb-2">Nuestra misión</h2>
              <p className="mb-0">
                Facilitar el acceso a productos para mascotas con una experiencia de compra simple,
                fichas claras y atención cercana. Ofrecemos opciones de entrega y un catálogo
                enfocado en calidad y confianza para cada cliente.
              </p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <h2 className="h5 fw-semibold mb-2">Nuestra visión</h2>
              <p className="mb-0">
                Ser la tienda online chilena de referencia en bienestar animal, con procesos
                transparentes y una experiencia de compra segura y personalizada para cada cliente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PILARES (exactos de tu página: Calidad, Variedad, Logística) */}
      <section className="mb-5">
        <h2 className="h5 fw-semibold mb-3">Nuestros pilares</h2>
        <div className="row g-3">
          <div className="col-12 col-md-4">
            <div className="border rounded p-3 h-100">
              <h3 className="h6 mb-1">Calidad confiable</h3>
              <p className="mb-0">Marcas probadas y reseñas reales de clientes.</p>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="border rounded p-3 h-100">
              <h3 className="h6 mb-1">Variedad de productos</h3>
              <p className="mb-0">Accesorios, alimentos y más para todas las mascotas.</p>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="border rounded p-3 h-100">
              <h3 className="h6 mb-1">Logística a tiempo</h3>
              <p className="mb-0">Despachos rápidos y seguimiento de tu compra.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA (alineado a tu versión original) */}
      <section className="text-center border rounded p-4 bg-light">
        <h2 className="h5 fw-semibold mb-2">¿Quieres sumarte a PetSocity?</h2>
        <p className="mb-3">
          Descubre nuestra tienda online y encuentra lo que tu mascota necesita.
        </p>
        <div className="d-flex gap-2 justify-content-center">
          <a className="btn btn-primary" href="/products">Ver productos</a>
          <a className="btn btn-outline-secondary" href="/contacto">Contáctanos</a>
        </div>
      </section>
    </main>
  );
}

'use client';

export default function NosotrosPage() {
  return (
    <main className="container py-5">
      {/* Petsocity */}
      <section className="row align-items-center g-4 mb-5">
        <div className="col-12 col-lg-7">
          <h1 className="display-6 fw-semibold">¿Quienes somos?</h1>
          <p className="mt-2">
            En Petsocity, somos una tienda chilena dedicada a ofrecer todo lo que tus mascotas necesitan para vivir felices y saludables. Nacimos con la idea de simplificar la experiencia de compra para las familias que buscan calidad, confianza y cercanía al elegir productos para sus compañeros de vida.
            Nuestro compromiso es brindar un servicio transparente y amigable, con un catálogo pensado en el bienestar animal. En Petsocity creemos que cada mascota merece lo mejor, por eso seleccionamos productos de calidad, trabajamos con marcas confiables y ofrecemos distintos métodos de entrega para adaptarnos a ti.
            Más que una tienda, somos un equipo que comparte el amor por los animales y busca acompañarte en cada etapa del cuidado de tus mascotas.
          </p>
        </div>
        <div className="col-12 col-lg-5 text-center">
          <img
            src="/perroPregunta.png"
            alt="PetSocity"
            className="img-fluid rounded shadow-sm"
          />
        </div>
      </section>

      {/* mision y vision */}
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

      {/* Pilares */}
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

      {/* Contactanos */}
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

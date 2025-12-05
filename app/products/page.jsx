import { getProductos } from "@/lib/services/productService";

export default async function ProductsPage() {
  const productos = await getProductos();

  return (
    <main className="container py-4">
      <h1>Productos</h1>

      <div className="row">
        {productos.map((p) => (
          <div key={p.id} className="col-md-4 mb-4">
            <div className="card h-100">
              <img src={p.imagen} className="card-img-top" alt={p.nombre} />
              <div className="card-body">
                <h5 className="card-title">{p.nombre}</h5>
                <p className="card-text">{p.descripcion}</p>
                <p className="fw-bold">${p.precio}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

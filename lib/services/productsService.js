// lib/services/productService.js

export async function getProductos() {
  const res = await fetch(
    "https://api-producto-production.up.railway.app/api/v1/productos",
    { cache: "no-store" } // evita cache en Next.js
  );

  if (!res.ok) {
    throw new Error("Error al obtener productos desde la API externa");
  }

  const data = await res.json();
  return data;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-producto-production.up.railway.app";

// Adaptador para transformar el JSON del backend al formato que espera el front
export function mapApiProduct(apiProd) {
  return {
    id: apiProd.idProducto,
    nombre: apiProd.nombre,
    descripcion: apiProd.descripcion,
    precio: Number(apiProd.precio),
    categoria: apiProd.categoria?.nombre ?? "",
    imagen: apiProd.imagenUrl ?? "",
    etiquetas: [],
  };
}

// Obtener todos los productos activos
export async function getProductos() {
  try {
    const res = await fetch(`${API_URL}/api/v1/productos`, { cache: "no-store" });
    if (!res.ok) throw new Error("Error al obtener productos");
    const data = await res.json();
    return data.map(mapApiProduct);
  } catch (error) {
    console.error("Error en getProductos:", error);
    return [];
  }
}

// Obtener producto por ID
export async function getProductoById(id) {
  try {
    const res = await fetch(`${API_URL}/api/v1/productos/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return mapApiProduct(data);
  } catch (error) {
    console.error("Error en getProductoById:", error);
    return null;
  }
}

// Obtener productos por categoria
export async function getProductosByCategoria(idCategoria) {
  try {
    const res = await fetch(`${API_URL}/api/v1/productos/categoria/${idCategoria}`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.map(mapApiProduct);
  } catch (error) {
    console.error("Error en getProductosByCategoria:", error);
    return [];
  }
}

// Crear producto (solo si más adelante hacemos un panel de admin)
export async function createProducto(producto) {
  const res = await fetch(`${API_URL}/api/v1/productos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(producto),
  });
  return await res.json();
}

// Actualizar producto
export async function updateProducto(id, data) {
  const res = await fetch(`${API_URL}/api/v1/productos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
}

// Eliminar / desactivar producto
export async function deleteProducto(id) {
  const res = await fetch(`${API_URL}/api/v1/productos/${id}`, {
    method: "DELETE",
  });
  return await res.json();
}

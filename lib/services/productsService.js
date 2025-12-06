export  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-producto-production.up.railway.app";

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

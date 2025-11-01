import { productos } from "@/data/products";

export const getProductos = () => productos;

export const getProductoById = (id) => 
  productos.find((p) => p.id === Number(id));

export const createProducto = (nuevo) => {
  productos.push(nuevo);
  return nuevo;
};

export const updateProducto = (id, data) => {
  const index = productos.findIndex((p) => p.id === Number(id));
  if (index === -1) return null;
  productos[index] = { ...productos[index], ...data };
  return productos[index];
};

export const deleteProducto = (id) => {
  const index = productos.findIndex((p) => p.id === Number(id));
  if (index === -1) return null;
  return productos.splice(index, 1);
};

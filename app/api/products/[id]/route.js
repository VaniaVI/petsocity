import { NextResponse } from "next/server";
import { getProductoById, updateProducto, deleteProducto } from "@/lib/services/productsService";

export async function GET(request, context) {
  const { id } = await context.params;

  const productId = Number(id);

  if (!productId || isNaN(productId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const product = getProductoById(productId); // ✅ llamada correcta

  if (!product) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }

  return NextResponse.json(product);
}


export async function PUT(req, { params }) {
  const data = await req.json();
  const actualizado = updateProducto(params.id, data);
  return actualizado
    ? NextResponse.json(actualizado)
    : NextResponse.json({ error: "No encontrado" }, { status: 404 });
}

export async function DELETE(_, { params }) {
  const eliminado = deleteProducto(params.id);
  return eliminado
    ? NextResponse.json({ success: true })
    : NextResponse.json({ error: "No encontrado" }, { status: 404 });
}

import { NextResponse } from "next/server";
import { getProductoById, updateProducto, deleteProducto } from "@/lib/services/productsService";

export async function GET(_, { params }) {
  const producto = getProductoById(params.id);
  return producto
    ? NextResponse.json(producto)
    : NextResponse.json({ error: "No encontrado" }, { status: 404 });
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

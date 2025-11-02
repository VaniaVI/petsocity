import { NextResponse } from "next/server";
import { getProductos, createProducto } from "@/lib/services/productsService";

export async function GET() {
  return NextResponse.json(getProductos());
}

export async function POST(req) {
  const data = await req.json();
  const nuevo = createProducto(data);
  return NextResponse.json(nuevo, { status: 201 });
}

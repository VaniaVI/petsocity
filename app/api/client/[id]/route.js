// app/api/clientes/[id]/route.js
import { NextResponse } from "next/server";
import { clientes } from "@/data/client"; // importamos array compartido

export async function GET(request, { params }) {
  const id = parseInt(params.id);
  const cliente = clientes.find((c) => c.id === id);

  if (!cliente) return NextResponse.json({ message: "Cliente no encontrado" }, { status: 404 });
  return NextResponse.json(cliente);
}

export async function PUT(request, { params }) {
  const id = parseInt(params.id);
  const body = await request.json();
  const index = clientes.findIndex(c => c.id === id);
  if (index === -1) return NextResponse.json({ message: "Cliente no encontrado" }, { status: 404 });

  clientes[index] = { ...clientes[index], ...body, fechaActualizacion: new Date().toISOString() };
  return NextResponse.json({ message: "Cliente actualizado", cliente: clientes[index] });
}

export async function DELETE(request, { params }) {
  const id = parseInt(params.id);
  const index = clientes.findIndex(c => c.id === id);
  if (index === -1) return NextResponse.json({ message: "Cliente no encontrado" }, { status: 404 });

  clientes.splice(index, 1);
  return NextResponse.json({ message: "Cliente eliminado" });
}

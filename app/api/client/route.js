import { NextResponse } from "next/server";
import { clientes, nextId } from "@/data/client";

/**
 * GET /api/clientes
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const correo = searchParams.get("correo");

  if (correo) {
    const cliente = clientes.find(c => c.correo.toLowerCase() === correo.toLowerCase());
    if (!cliente) return NextResponse.json({ message: "Cliente no encontrado" }, { status: 404 });
    return NextResponse.json(cliente);
  }

  return NextResponse.json(clientes);
}

/**
 * POST /api/clientes
 */
export async function POST(request) {
  const body = await request.json();

  if (!body.nombre || !body.correo) {
    return NextResponse.json({ message: "Nombre y correo son obligatorios" }, { status: 400 });
  }

  if (clientes.some(c => c.correo.toLowerCase() === body.correo.toLowerCase())) {
    return NextResponse.json({ message: "El correo ya está registrado" }, { status: 409 });
  }

  const nuevoCliente = {
    id: nextId++,
    nombre: body.nombre,
    apellidos: body.apellidos || "",
    correo: body.correo,
    telefono: body.telefono || null,
    direccion: body.direccion || null,
    region: body.region || null,
    comuna: body.comuna || null,
    fechaRegistro: new Date().toISOString(),
  };

  clientes.push(nuevoCliente);

  return NextResponse.json({ message: "Cliente creado exitosamente", cliente: nuevoCliente }, { status: 201 });
}

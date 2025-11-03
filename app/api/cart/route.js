// app/api/cart/route.js
// ⚠️ NOTA: Este archivo API es OPCIONAL ya que usamos localStorage client-side
// Solo implementar si necesitas sincronización con backend o autenticación

import { NextResponse } from "next/server";

/**
 * Esta API route está preparada para futuras implementaciones con backend
 * Por ahora, todo el carrito funciona client-side con localStorage
 */

export async function GET(request) {
  return NextResponse.json({
    message: "El carrito funciona client-side. Esta ruta está reservada para futuras integraciones.",
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validación básica
    if (!body || !body.id) {
      return NextResponse.json(
        { error: "Producto inválido: falta el ID" },
        { status: 400 }
      );
    }

    // Aquí iría la lógica para guardar en BD si fuera necesario
    // Por ahora retornamos éxito ya que el carrito es client-side
    
    return NextResponse.json({ 
      ok: true,
      message: "Operación manejada client-side"
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error procesando solicitud" },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    
    if (!body?.id) {
      return NextResponse.json(
        { error: "ID requerido" },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      ok: true,
      message: "Operación manejada client-side"
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error procesando solicitud" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    return NextResponse.json({ 
      ok: true,
      message: "Operación manejada client-side"
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error procesando solicitud" },
      { status: 500 }
    );
  }
}
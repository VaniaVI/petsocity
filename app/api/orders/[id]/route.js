import { NextResponse } from "next/server";
import { getOrderById } from "@/lib/services/orderService"; // ejemplo

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const order = await getOrderById(id);

    if (!order) {
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("Error al obtener orden:", error);
    return NextResponse.json(
      { error: "Error interno al obtener la orden" },
      { status: 500 }
    );
  }
}

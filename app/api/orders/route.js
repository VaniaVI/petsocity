// app/api/orders/route.js
import { NextResponse } from "next/server";

// Base de datos temporal en memoria (prototipo)
let orders = [];

function generateOrderCode() {
  const timestamp = Date.now();
  return {
    orderNumber: `#${timestamp}`,
    orderCode: `ORDER${timestamp}`,
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("BODY RECIBIDO EN API:", body); // 👈 AGREGA ESTO
    const { orderNumber, orderCode } = generateOrderCode();

    const newOrder = {
      id: Date.now().toString(), // ID interno de la orden
      orderNumber,
      orderCode,
      ...body, // userId, customerData, cartItems, totals, deliveryMethod
      createdAt: new Date().toISOString(),
    };

    orders.push(newOrder);

    return NextResponse.json(
      {
        success: true,
        orderId: newOrder.id,
        orderNumber,
        orderCode,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creando orden:", error);
    return NextResponse.json(
      { error: "Error al crear la orden" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Falta el id de la orden" },
      { status: 400 }
    );
  }

  const order = orders.find((o) => o.id === id);

  if (!order) {
    return NextResponse.json(
      { error: "Orden no encontrada" },
      { status: 404 }
    );
  }

  return NextResponse.json(order, { status: 200 });
}

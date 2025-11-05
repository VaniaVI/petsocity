// app/api/orders/route.js
import { NextResponse } from "next/server";

let orders = [];
let nextId = 1;

export async function POST(request) {
  try {
    const body = await request.json();
    
    const newOrder = {
      orderId: String(nextId++),
      ...body,
      createdAt: new Date().toISOString(),
    };

    orders.push(newOrder);

    // ✅ IMPORTANTE: Retornar el orderId
    return NextResponse.json({ orderId: newOrder.orderId }, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Error al crear orden" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { getPosts, createPost } from "@/lib/services/blogService";

// GET /api/blog → lista todos los posts
export async function GET() {
  return NextResponse.json(getPosts());
}

// POST /api/blog → crea un nuevo post
export async function POST(req) {
  const data = await req.json();
  const nuevo = createPost(data);
  return NextResponse.json(nuevo, { status: 201 });
}
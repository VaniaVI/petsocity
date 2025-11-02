import { NextResponse } from "next/server";
import { getPostById, updatePost, deletePost } from "@/lib/services/blogService";

// GET /api/blog/:id → obtiene un post por id
export async function GET(_req, { params }) {
  const post = getPostById(params.id);
  return post
    ? NextResponse.json(post)
    : NextResponse.json({ error: "No encontrado" }, { status: 404 });
}

// PUT /api/blog/:id → actualiza un post
export async function PUT(req, { params }) {
  const data = await req.json();
  const actualizado = updatePost(params.id, data);
  return actualizado
    ? NextResponse.json(actualizado)
    : NextResponse.json({ error: "No encontrado" }, { status: 404 });
}

// DELETE /api/blog/:id → elimina un post
export async function DELETE(_req, { params }) {
  const eliminado = deletePost(params.id);
  return eliminado
    ? NextResponse.json({ success: true, eliminado })
    : NextResponse.json({ error: "No encontrado" }, { status: 404 });
}
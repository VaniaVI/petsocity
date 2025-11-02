import { NextResponse } from "next/server";
import { getPostById, updatePost, deletePost } from "@/lib/services/blogService";

// GET /api/blog/:id → obtiene un post por id
export async function GET(_req, context) {
  const { id } = await context.params; //  Next.js 15+: params es async
  const postId = Number(id);

  if (!postId || isNaN(postId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const post = getPostById(postId);
  return post
    ? NextResponse.json(post)
    : NextResponse.json({ error: "No encontrado" }, { status: 404 });
}

// PUT /api/blog/:id → actualiza un post
export async function PUT(req, context) {
  const { id } = await context.params;
  const postId = Number(id);

  if (!postId || isNaN(postId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const data = await req.json();
  const actualizado = updatePost(postId, data);

  return actualizado
    ? NextResponse.json(actualizado)
    : NextResponse.json({ error: "No encontrado" }, { status: 404 });
}

// DELETE /api/blog/:id → elimina un post
export async function DELETE(_req, context) {
  const { id } = await context.params;
  const postId = Number(id);

  if (!postId || isNaN(postId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const eliminado = deletePost(postId);

  return eliminado
    ? NextResponse.json({ success: true, eliminado })
    : NextResponse.json({ error: "No encontrado" }, { status: 404 });
}
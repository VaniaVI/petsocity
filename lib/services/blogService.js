import { posts } from "@/data/blog";

export const getPosts = () => posts;

export const getPostById = (id) =>
  posts.find((p) => p.id === Number(id));

export const createPost = (nuevo) => {
  const nuevoId = posts.length > 0 ? posts[posts.length - 1].id + 1 : 1;
  const postConId = { id: nuevoId, ...nuevo };
  posts.push(postConId);
  return postConId;
};

export const updatePost = (id, data) => {
  const index = posts.findIndex((p) => p.id === Number(id));
  if (index === -1) return null;
  posts[index] = { ...posts[index], ...data };
  return posts[index];
};

export const deletePost = (id) => {
  const index = posts.findIndex((p) => p.id === Number(id));
  if (index === -1) return null;
  const eliminado = posts[index];
  posts.splice(index, 1);
  return eliminado;
};
import { Comment } from '../types/post.types';

interface CommentInput {
  content: string;
}

export async function getComments(postId: string | number): Promise<Comment[]> {
  const res = await fetch(`http://localhost:8080/api/posts/${postId}/comments`);

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Erreur serveur:", errorText);
    throw new Error("Impossible de récupérer les commentaires");
  }

  const data = await res.json();
  return data.data;
}

export async function addComment(postId: string | number, content: string): Promise<Comment> {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Utilisateur non authentifié');
  }

  const commentData: CommentInput = {
    content: content
  };

  try {
    const response = await fetch(`http://localhost:8080/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(commentData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Erreur lors de l'ajout du commentaire");
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout du commentaire:", error);
    throw error;
  }
} 

export const updateComment = async (commentId: number, content: string) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Utilisateur non authentifié");
  const response = await fetch(`http://localhost:8080/api/comments/${commentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });
  if (!response.ok) throw new Error(await response.text());
  return (await response.json()).data;
};
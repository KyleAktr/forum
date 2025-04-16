import { Post } from '../types';

export const addReaction = async (postId: number, type: 'like'): Promise<Post> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Utilisateur non authentifié');
  }

  try {
    const response = await fetch(`http://localhost:8080/api/posts/${postId}/reactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ type })
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || 'Erreur lors de l\'ajout du like');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Erreur lors de l\'ajout du like:', error);
    throw error;
  }
};

export const removeReaction = async (postId: number, reactionId: number): Promise<Post> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Utilisateur non authentifié');
  }

  try {
    const response = await fetch(`http://localhost:8080/api/posts/${postId}/reactions/${reactionId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || 'Erreur lors de la suppression du like');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Erreur lors de la suppression du like:', error);
    throw error;
  }
}; 
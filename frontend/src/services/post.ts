interface Post {
  id: number;
  title: string;
  content: string;
  category_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    username: string;
  };
  category: {
    id: number;
    name: string;
  };
  comments: any[];
  reactions: any[];
}

interface CreatePostInput {
  title: string;
  content: string;
  category_id: number;
}

export const createPost = async (data: CreatePostInput): Promise<Post> => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Utilisateur non authentifié");
  }

  const response = await fetch("http://localhost:8080/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erreur lors de la création du post");
  }

  return response.json();
};

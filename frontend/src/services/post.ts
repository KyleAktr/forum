export interface Post {
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

  try {
       const response = await fetch("http://localhost:8080/api/user/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });


    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erreur serveur:", errorText);
      throw new Error(errorText || "Erreur lors de la création du post");
    }

    const result = await response.json();
    console.log("Réponse reçue:", result);
    return result.data;
  } catch (err) {
    console.error("Erreur détaillée:", err);
    throw err;
  }
};

export async function getMyPosts(token: string) {
  const res = await fetch("http://localhost:8080/api/user/posts", {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Erreur serveur:", errorText);
    throw new Error("Impossible de récupérer les posts");
  }

  const data = await res.json();
  return data.data;
}

export async function getPosts() {
  const res = await fetch("http://localhost:8080/api/posts", {});

  if (!res.ok) {
    throw new Error("Impossible de récupérer les posts");
  }

  const data = await res.json();
  return data.data; // tableau de posts
}

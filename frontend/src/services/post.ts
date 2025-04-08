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
  console.log("Token envoyé:", token);
  if (!token) {
    throw new Error("Utilisateur non authentifié");
  }

  try {
    const response = await fetch("http://localhost:8080/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    // Vérifie si la réponse est au format JSON
    const contentType = response.headers.get("Content-Type");

    if (!response.ok) {
      // Si la réponse n'est pas OK, afficher un message d'erreur.
      const errorText = await response.text(); // Récupère le corps brut de la réponse
      console.error("Erreur serveur : ", errorText);
      throw new Error(errorText || "Erreur lors de la création du post");
    }

    if (contentType && contentType.includes("application/json")) {
      // Si la réponse est JSON, la parser
      return await response.json();
    } else {
      // Si ce n'est pas du JSON, afficher l'erreur
      const errorText = await response.text();
      console.error("La réponse n'est pas du JSON : ", errorText);
      throw new Error("La réponse n'est pas au format JSON.");
    }
  } catch (err) {
    console.error("Erreur lors de la requête:", err);
    throw new Error("Erreur réseau ou serveur");
  }
};

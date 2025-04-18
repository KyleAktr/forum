"use client";

import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPost } from "@/services/post";
import { isAuthenticated } from "@/services/auth";
import TiptapEditor from "@/components/TiptapEditor";

export default function Page() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    category: 1,
  });
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createPost({
        title: formData.title,
        content,
        category_id: formData.category,
      });
      router.push(`/`);
    } catch (err) {
      console.error("Erreur lors de la création du post", err);
      setError("Erreur lors de la création de l'article. Veuillez réessayer.");
    }
  };

  return (
    <div>
      <Navbar />
      <header>
        <h1>Créer un article</h1>
      </header>

      <div>
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <label htmlFor="title">Titre :</label>
          <input
            type="text"
            name="title"
            id="title"
            placeholder="Titre de l'article"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
          <br />

          <label htmlFor="category_id">Catégorie :</label>
          <select
            id="category_id"
            name="category_id"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: Number(e.target.value) })
            }
            required
          >
            <option value="1">Travail hybride et télétravail</option>
            <option value="2">Minimalisme et frugalité</option>
            <option value="3">Santé mentale et digitale</option>
            <option value="4">Lifestyle durable</option>
          </select>

          <br />
          <label>Contenu de l&apos;article :</label>
          <div className="creation-article-content">
            <TiptapEditor content={content} onChange={setContent} />
          </div>
          <br />

          <button type="submit">Publier l&apos;article</button>
        </form>
      </div>
    </div>
  );
}

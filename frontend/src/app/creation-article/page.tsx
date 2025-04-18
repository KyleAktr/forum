"use client";

import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPost } from "@/services/post";
import { isAuthenticated } from "@/services/auth";
import TiptapEditor from "@/components/TiptapEditor";
import Footer from "@/components/Footer";

export default function Page() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    category: 0,
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
      <header className="header-creation-article">
        <h1>Espace Création</h1>
        <p>
          Cet espace est conçu pour vous permettre de vous exprimer librement et
          de partager vos idées de manière claire et structurée. L’objectif ici
          est de créer des articles bien organisés, intéressants et faciles à
          lire. <br />
          <br />
          Que vous soyez novice ou expérimenté, vous trouverez tous les outils
          nécessaires pour structurer vos textes de manière optimale : vous
          pouvez ajouter des titres, des sous-titres, organiser vos idées sous
          forme de listes et bien plus encore. La mise en forme est facilitée
          pour que vous puissiez mettre en évidence vos points importants, que
          ce soit en utilisant le gras, l’italique ou d'autres options de style.{" "}
          <br />
          <br />
          N’oubliez pas, un article bien structuré est un article qui capte
          l’attention de son lecteur et lui permet de comprendre facilement vos
          idées. Prenez votre temps, soyez créatif, et laissez parler votre
          plume !
        </p>
      </header>

      <div>
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <label htmlFor="title"></label>
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

          <label htmlFor="category_id"></label>
          <select
            id="category_id"
            name="category_id"
            value={formData.category || ""}
            onChange={(e) =>
              setFormData({ ...formData, category: Number(e.target.value) })
            }
            required
          >
            <option value="" disabled>
              Veuillez sélectionner une catégorie
            </option>
            <option value="1">Travail hybride et télétravail</option>
            <option value="2">Minimalisme et frugalité</option>
            <option value="3">Santé mentale et digitale</option>
            <option value="4">Lifestyle durable</option>
          </select>

          <br />
          <div className="creation-article-content">
            <TiptapEditor content={content} onChange={setContent} />
          </div>
          <br />

          <button className="submit" type="submit">
            Publier l&apos;article
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

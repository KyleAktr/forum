"use client";

import { useEffect, useState } from "react";
import { getArticleById } from "@/services/article";
import Link from "next/link";
import Navbar from "@/components/Navbar";

type Props = {
  params: { id: string };
};

export default function ArticlePage({ params }: Props) {
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const data = await getArticleById(params.id);
        setArticle(data);
      } catch (err) {
        console.error("Erreur lors de la récupération de l'article :", err);
        setError("Impossible de charger l'article.");
      } finally {
        setLoading(false);
      }
    };

    console.log("hello");

    fetchArticle();
  }, []);

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!article) {
    return <p>Aucun article trouvé.</p>;
  }

  return (
    <div>
      <Navbar />
      <h1>Article ID: {params.id}</h1>
      <h2>{article.title}</h2>
      <p>{article.content}</p>
      <p>
        Date de création : {new Date(article.created_at).toLocaleDateString()}
      </p>
      <p>Auteur : {article.user ? article.user.username : "Inconnu"}</p>

      {article.user && (
        <Link href={`/profil/${article.user.id}`}>
          Voir le profil de l'auteur
        </Link>
      )}
    </div>
  );
}

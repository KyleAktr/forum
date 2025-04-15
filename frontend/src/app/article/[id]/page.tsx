"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ArticlePage({ params }: { params: { id: string } }) {
  const [article, setArticle] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchArticle = async () => {
      const res = await fetch(`http://localhost:8080/api/posts/${params.id}`);
      if (!res.ok) {
        console.error("Erreur lors de la récupération de l'article");
        return;
      }
      const data = await res.json();
      setArticle(data);
    };

    fetchArticle();
  }, [params.id]);

  if (!article) {
    return <p>Chargement...</p>;
  }

  return (
    <div>
      <h1>{article.title}</h1>
      <p>{article.content}</p>
      <button onClick={() => router.back()}>Retour</button>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { getArticleById } from "@/services/article";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import CommentList from "@/components/CommentList";
import CommentForm from "@/components/CommentForm";
import LikeButton from "@/components/LikeButton";
import { Post } from "@/types";
import Footer from "@/components/Footer";

type Props = {
  params: { id: string };
};

export default function ArticlePage({ params }: Props) {
  const [article, setArticle] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentsRefreshKey, setCommentsRefreshKey] = useState(0);

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

    fetchArticle();
  }, [params.id]);

  const handleCommentAdded = () => {
    // Déclencher le rechargement des commentaires en changeant la clé
    setCommentsRefreshKey((prevKey) => prevKey + 1);
  };

  const handlePostUpdate = (updatedPost: Post) => {
    setArticle(updatedPost);
  };

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
      <div className="article">
        <p className="author">
          <Image
            src={
              article.user.profilePicture?.startsWith("http")
                ? article.user.profilePicture
                : `http://localhost:8080${article.user.profilePicture || ""}`
            }
            alt="Photo de profil"
            width={150}
            height={150}
            className="profile-picture"
            unoptimized
          />
          {article.user && (
            <Link href={`/profil/${article.user.id}`} className="author-link">
              {article.user ? article.user.username : "Inconnu"}{" "}
            </Link>
          )}{" "}
          {new Date(article.created_at).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <h2>{article.title}</h2>
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        <div className="article-actions">
          <LikeButton post={article} onReactionUpdate={handlePostUpdate} />
        </div>

        <div className="comments-container">
          <CommentForm postId={params.id} onCommentAdded={handleCommentAdded} />

          <CommentList key={commentsRefreshKey} postId={params.id} />
        </div>
      </div>
      <Footer />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { getArticleById } from "@/services/article";
import { updatePost, deletePost } from "@/services/post";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import CommentList from "@/components/CommentList";
import CommentForm from "@/components/CommentForm";
import LikeButton from "@/components/LikeButton";
import { Post } from "@/types";
import Footer from "@/components/Footer";
import { getUser } from "@/services/auth";
import TiptapEditor from "@/components/TiptapEditor";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  params: { id: string };
};

export default function ArticlePage({ params }: Props) {
  const [article, setArticle] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentsRefreshKey, setCommentsRefreshKey] = useState(0);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    content: "",
    category_id: 1
  });
  const [isSaving, setIsSaving] = useState(false);
  
  const currentUser = getUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editMode = searchParams.get("edit") === "true";
  
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const data = await getArticleById(params.id);
        setArticle(data);
        
        setEditForm({
          title: data.title,
          content: data.content,
          category_id: data.category_id
        });
      } catch (err) {
        console.error("Erreur lors de la récupération de l'article :", err);
        setError("Impossible de charger l'article.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [params.id]);

  useEffect(() => {
    if (editMode && article) {
      setIsEditing(true);
    }
  }, [editMode, article]);

  // Vérifier également le localStorage pour le mode édition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Récupère les données stockées dans la page de profil
      const editMode = localStorage.getItem('editArticleMode') === 'true';
      const editArticleId = localStorage.getItem('editArticleId');
      
      // Vérifie si on doit passer en mode édition :
      // 1. Le mode édition est activé dans localStorage
      // 2. L'ID de l'article correspond à celui qu'on veut éditer
      // 3. L'article a bien été chargé
      if (editMode && editArticleId === params.id && article) {
        // Active le mode édition
        setIsEditing(true);
        
        // Nettoie le localStorage pour éviter de réactiver le mode édition
        // lors d'une visite ultérieure de la page
        localStorage.removeItem('editArticleMode');
        localStorage.removeItem('editArticleId');
      }
    }
  }, [article, params.id]);

  const handleCommentAdded = () => {
    setCommentsRefreshKey(prevKey => prevKey + 1);
  };

  const handlePostUpdate = (updatedPost: Post) => {
    setArticle(updatedPost);
  };
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  // Annuler l'édition
  const handleCancelEdit = () => {
    // Réinitialiser le formulaire avec les données actuelles de l'article
    if (article) {
      setEditForm({
        title: article.title,
        content: article.content,
        category_id: article.category_id
      });
    }
    setIsEditing(false);
  };
  
  const handleSaveEdit = async () => {
    if (!article) return;
    
    setIsSaving(true);
    try {
      const updatedArticle = await updatePost(article.id, editForm);
      setArticle(updatedArticle);
      setIsEditing(false);
    } catch (err) {
      console.error("Erreur lors de la mise à jour de l'article :", err);
      setError("Impossible de sauvegarder les modifications.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!article) return;
    
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
      try {
        await deletePost(article.id);
        router.push('/');
      } catch (err) {
        console.error("Erreur lors de la suppression de l'article :", err);
        setError("Impossible de supprimer l'article.");
      }
    }
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
  
  const isAuthor = currentUser && currentUser.id === article.user_id;

  return (
    <div>
      <Navbar />
      <div className="article">
        <p className="author">
          <Image
            src={
              article.user.profilePicture?.startsWith("http")
                ? article.user.profilePicture
                : `http://localhost:8080${article.user.profilePicture || ''}`
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

        {isEditing ? (
          <div className="article-edit-form">
            <div className="form-group">
              <label htmlFor="title">Titre</label>
              <input
                type="text"
                id="title"
                value={editForm.title}
                onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                required
                className="edit-title-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="content">Contenu</label>
              <TiptapEditor 
                content={editForm.content}
                onChange={(newContent) => setEditForm({...editForm, content: newContent})}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="category">Catégorie</label>
              <select
                id="category"
                value={editForm.category_id}
                onChange={(e) => setEditForm({...editForm, category_id: parseInt(e.target.value)})}
                required
                className="edit-category-select"
              >
                <option value="1">Travail hybride et télétravail</option>
                <option value="2">Minimalisme et frugalité</option>
                <option value="3">Santé mentale et digitale</option>
                <option value="4">Lifestyle durable</option>
              </select>
            </div>
            
            <div className="edit-actions">
              <button 
                onClick={handleSaveEdit} 
                className="save-button"
                disabled={isSaving}
              >
                {isSaving ? "Enregistrement..." : "Enregistrer"}
              </button>
              <button 
                onClick={handleCancelEdit} 
                className="cancel-button"
                disabled={isSaving}
              >
                Annuler
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2>{article.title}</h2>
            <div className="article-content" dangerouslySetInnerHTML={{__html: article.content}} />
          </>
        )}
        
        <div className="article-actions">
          <LikeButton 
            post={article} 
            onReactionUpdate={handlePostUpdate} 
          />
          
          {isAuthor && !isEditing && (
            <div className="author-actions">
              <button 
                className="edit-button"
                onClick={handleEdit}
              >
                Modifier
              </button>
              <button 
                className="delete-button"
                onClick={handleDelete}
              >
                Supprimer
              </button>
            </div>
          )}
        </div>
        
        <div className="comments-container">
          <CommentForm 
            postId={params.id} 
            onCommentAdded={handleCommentAdded} 
          />
          
          <CommentList 
            key={commentsRefreshKey} 
            postId={params.id} 
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}

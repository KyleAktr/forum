import { useEffect, useState } from "react";
import { Comment } from "@/types/post.types";
import { getComments, updateComment, deleteComment } from "@/services/comments";
import Image from "next/image";
import Link from "next/link";
import { getUser } from "@/services/auth";


interface CommentListProps {
  postId: string | number;
}

export default function CommentList({ postId }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditingId, setIsEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const currentUser = getUser();
  
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const fetchedComments = await getComments(postId);
        setComments(fetchedComments);
      } catch (err) {
        console.error("Erreur lors de la récupération des commentaires:", err);
        setError("Impossible de charger les commentaires");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  const handleEditClick = (comment: Comment) => {
    setIsEditingId(comment.id);
    setEditContent(comment.content);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditingId === null) return;
    setIsSaving(true);
    try {
      const updated = await updateComment(isEditingId, editContent);
      setComments(comments.map(c => c.id === isEditingId ? { ...c, content: updated.content } : c));
      setIsEditingId(null);
      setEditContent("");
    } catch (err) {
      console.error("Erreur lors de la modification du commentaire:", err);
      alert("Erreur lors de la modification du commentaire");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = async (commentId: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?")) {
      try {
        await deleteComment(commentId);
        setComments(comments.filter(c => c.id !== commentId));
      } catch (err) {
        console.error("Erreur lors de la suppression du commentaire:", err);
        alert("Erreur lors de la suppression du commentaire");
      }
    }
  };

  if (loading) {
    return <p>Chargement des commentaires...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (comments.length === 0) {
    return <p>Aucun commentaire pour cet article.</p>;
  }

  return (
    <div className="comments-section">
      <h3>Commentaires ({comments.length})</h3>
      <ul className="comment-list">
        {comments.map((comment) => (
          <li key={comment.id} className="comment-item">
            <div className="comment-header">
              {isEditingId === comment.id ? (
                <form onSubmit={handleEditSubmit} className="edit-comment-form">
                  <input
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    disabled={isSaving}
                  />
                  <button type="submit" disabled={isSaving}>
                    {isSaving ? "Enregistrement..." : "Enregistrer"}
                  </button>
                  <button type="button" onClick={() => setIsEditingId(null)} disabled={isSaving}>
                    Annuler
                  </button>
                </form>
              ) : (
                <>
                  <p className="comment-content">{comment.content}</p>
                  <p className="author">
                    <Image
                      src={
                        comment.user.profilePicture?.startsWith("http")
                          ? comment.user.profilePicture
                          : `http://localhost:8080${
                              comment.user.profilePicture || ""
                            }`
                      }
                      alt="Photo de profil"
                      width={150}
                      height={150}
                      className="profile-picture"
                      unoptimized
                    />
                    {comment.user && (
                      <Link
                        href={`/profil/${comment.user.id}`}
                        className="author-link"
                      >
                        {comment.user ? comment.user.username : "Inconnu"}{" "}
                      </Link>
                    )}{" "}
                    {new Date(comment.created_at).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  {currentUser && currentUser.id === comment.user.id && (
                    <div className="comment-actions">
                      <button onClick={() => handleEditClick(comment)}>Modifier</button>
                      <button onClick={() => handleDeleteClick(comment.id)}>Supprimer</button>
                    </div>
                  )}
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Comment } from "@/types/post.types";
import { getComments } from "@/services/comments";
import Image from "next/image";
import Link from "next/link";

interface CommentListProps {
  postId: string | number;
}

export default function CommentList({ postId }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Post } from '@/types';
import { updatePost } from '@/services/post';

interface EditPostModalProps {
  post: Post;
  onClose: () => void;
  onSave: (updatedPost: Post) => void;
}

export default function EditPostModal({ post, onClose, onSave }: EditPostModalProps) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [categoryId, setCategoryId] = useState(post.category_id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const updatedPost = await updatePost(post.id, {
        title,
        content,
        category_id: categoryId
      });
      onSave(updatedPost);
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erreur lors de la mise à jour du post");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Modifier l'article</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Titre</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="content">Contenu</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={10}
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="category">Catégorie</label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(parseInt(e.target.value))}
              required
            >
              <option value="1">Télétravail</option>
              <option value="2">Minimalisme</option>
              <option value="3">Santé digitale</option>
              <option value="4">Lifestyle</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" className="save-button" disabled={isSubmitting}>
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </button>
            <button type="button" className="cancel-button" onClick={onClose}>
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
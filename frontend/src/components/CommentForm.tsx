import { useState } from 'react';
import { addComment } from '@/services/comments';
import { getUser } from '@/services/auth';

interface CommentFormProps {
  postId: string | number;
  onCommentAdded: () => void;
}

export default function CommentForm({ postId, onCommentAdded }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const user = getUser();
    if (!user) {
      setError('Vous devez être connecté pour commenter');
      return;
    }

    if (!content.trim()) {
      setError('Le commentaire ne peut pas être vide');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      await addComment(postId, content);
      
      setContent('');
      
      onCommentAdded();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur s'est produite lors de l'ajout du commentaire");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="comment-form-container">
      <h3>Ajouter un commentaire</h3>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="comment-form">
        <textarea
          placeholder="Écrivez votre commentaire ici..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting}
          rows={4}
          className="comment-textarea"
        />
        <button 
          type="submit" 
          disabled={isSubmitting || !content.trim()}
          className="comment-submit-button"
        >
          {isSubmitting ? 'Envoi en cours...' : 'Publier'}
        </button>
      </form>
    </div>
  );
} 
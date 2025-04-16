import { useState, useEffect } from 'react';
import { FaThumbsUp, FaRegThumbsUp } from 'react-icons/fa';
import { addReaction, removeReaction } from '@/services/reaction';
import { getUser } from '@/services/auth';
import { Post } from '@/types';

interface LikeButtonProps {
  post: Post;
  onReactionUpdate?: (updatedPost: Post) => void;
}

export default function LikeButton({ post, onReactionUpdate }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [userReactionId, setUserReactionId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialiser l'état des likes
  useEffect(() => {
    const user = getUser();
    if (!user) return;

    // Compte les likes
    let likes = 0;

    post.reactions.forEach(reaction => {
      if (reaction.like) {
        likes++;
      }

      // Vérifie si l'utilisateur a déjà liké
      if (reaction.user_id === user.id && reaction.like) {
        setIsLiked(true);
        setUserReactionId(reaction.id);
      }
    });

    setLikeCount(likes);
  }, [post.reactions]);

  const handleLike = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const user = getUser();
      if (!user) {
        alert('Connectez-vous pour liker ce post');
        setIsLoading(false);
        return;
      }

      let updatedPost: Post | undefined;

      if (isLiked) {
        // Si déjà aimé, on supprime le like
        if (userReactionId) {
          updatedPost = await removeReaction(post.id, userReactionId);
          setIsLiked(false);
          setUserReactionId(null);
        }
      } else {
        // On ajoute le like
        updatedPost = await addReaction(post.id, 'like');
        setIsLiked(true);
        
        // Trouver l'ID de la nouvelle réaction
        const user = getUser();
        const newReaction = updatedPost.reactions.find(
          r => r.user_id === user?.id && r.like
        );
        if (newReaction) {
          setUserReactionId(newReaction.id);
        }
      }

      // Mettre à jour le composant parent si nécessaire
      if (updatedPost && onReactionUpdate) {
        onReactionUpdate(updatedPost);
      }
    } catch (error) {
      console.error('Erreur lors du like:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reaction-buttons">
      <button 
        className={`like-button ${isLiked ? 'active' : ''}`} 
        onClick={handleLike}
        disabled={isLoading}
      >
        {isLiked ? <FaThumbsUp /> : <FaRegThumbsUp />}
        <span>{likeCount}</span>
      </button>
    </div>
  );
} 
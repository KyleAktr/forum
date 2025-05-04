"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { Post, Comment } from "@/types";
import Link from "next/link";
import LikeButton from "@/components/LikeButton";
import Footer from "@/components/Footer";

type UserProfile = {
  id: number;
  username: string;
  email: string;
  city?: string;
  age?: number;
  bio?: string;
  profilePicture?: string;
};

export default function PublicProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [userComments, setUserComments] = useState<Comment[]>([]);
  const [error, setError] = useState("");

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:8080/api/user/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Utilisateur introuvable");
      const json = await res.json();
      setProfile(json.data);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la récupération du profil");
    }
  }, [id]);

  const fetchUserPosts = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:8080/api/user/${id}/posts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Impossible de récupérer les articles");
      const data = await res.json();
      setUserPosts(data.data);
    } catch (err) {
      console.error("Erreur lors de la récupération des articles:", err);
    }
  }, [id]);

  const fetchUserComments = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:8080/api/user/${id}/comments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Impossible de récupérer les commentaires");
      const data = await res.json();
      setUserComments(data.data);
    } catch (err) {
      console.error("Erreur lors de la récupération des commentaires:", err);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchUser();
      fetchUserPosts();
      fetchUserComments();
    }
  }, [id, fetchUser, fetchUserPosts, fetchUserComments]);

  const handlePostUpdate = (updatedPost: Post) => {
    setUserPosts(
      userPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  };

  const getFirstBlockFromHTML = (htmlString: string) => {
    if (typeof window === "undefined") return ""; // sécurité SSR
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const firstBlock = doc.body.firstElementChild;
    return firstBlock ? firstBlock.outerHTML : "";
  };

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="profile-container">
          <h1>Erreur</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div>
        <Navbar />
        <div className="profile-container">
          <h1>Chargement...</h1>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="profile-container">
        <div className="profile-picture-container">
          <div className="profile-picture-wrapper">
            {profile.profilePicture ? (
              <Image
                src={
                  profile.profilePicture.startsWith("http")
                    ? profile.profilePicture
                    : `http://localhost:8080${profile.profilePicture}`
                }
                alt="Photo de profil"
                width={150}
                height={150}
                className="profile-picture"
                unoptimized
              />
            ) : (
              <div className="profile-picture-placeholder">
                {profile.username[0].toUpperCase()}
              </div>
            )}
          </div>
          <h3>{profile.username}</h3>
        </div>

        <div className="profile-info">
          <h2>Infos</h2>
          <div className="info-group">
            <h3>
              Email : <span>{profile.email}</span>
            </h3>
          </div>
          <div className="info-group">
            <h3>
              Ville : <span>{profile.city || "Non renseigné"}</span>
            </h3>
          </div>
          <div className="info-group">
            <h3>
              Âge : <span>{profile.age || "Non renseigné"}</span>
            </h3>
          </div>
          <div className="info-group">
            <h3>
              Bio : <span>{profile.bio || "Non renseigné"}</span>
            </h3>
          </div>
        </div>
      </div>
      
      <div className="user-content-container">
        <div className="user-posts">
          <h2>Publications de {profile.username}</h2>
          {userPosts.length === 0 ? (
            <p>Cet utilisateur n&apos;a pas encore publié d&apos;article.</p>
          ) : (
            <ul className="posts-list">
              {[...userPosts]
                .sort(
                  (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
                )
                .map((post: Post) => (
                  <li key={post.id} className="post-item">
                    <h3>{post.title}</h3>

                    <div
                      className="article-content"
                      dangerouslySetInnerHTML={{
                        __html: getFirstBlockFromHTML(post.content),
                      }}
                    />
                    <p className="meta">
                      Posté le {new Date(post.created_at).toLocaleDateString()}{" "}
                      par{" "}
                      {post.user && (
                        <Link
                          href={`/profil/${post.user.id}`}
                          className="author-link"
                        >
                          {post.user ? post.user.username : "Inconnu"}{" "}
                        </Link>
                      )}
                      <Image
                        src={
                          post.user?.profilePicture?.startsWith("http")
                            ? post.user.profilePicture
                            : post.user?.profilePicture
                            ? `http://localhost:8080${post.user.profilePicture}`
                            : "/default-avatar.png"
                        }
                        alt="Photo de profil"
                        width={150}
                        height={150}
                        className="profile-picture"
                        unoptimized
                      />
                    </p>
                    <div className="post-actions">
                      <LikeButton
                        post={post}
                        onReactionUpdate={handlePostUpdate}
                      />
                      <Link href={`/article/${post.id}`}>
                        <button className="view-article-button">
                          Voir l&apos;article
                        </button>
                      </Link>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </div>
        
        <div className="user-comments">
          <h2>Commentaires de {profile.username}</h2>
          {userComments.length === 0 ? (
            <p>Cet utilisateur n&apos;a pas encore publié de commentaire.</p>
          ) : (
            <ul className="posts-list">
              {[...userComments]
                .sort(
                  (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
                )
                .map((comment) => (
                  <li key={comment.id} className="post-item">
                    <h3>Commentaire</h3>
                    <div className="article-content">
                      {comment.content}
                    </div>
                    <p className="meta">
                      Commenté le {new Date(comment.created_at).toLocaleDateString()}
                    </p>
                    <div className="post-actions">
                      <Link href={`/article/${comment.post_id}`}>
                        <button className="view-article-button">
                          Voir l&apos;article
                        </button>
                      </Link>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

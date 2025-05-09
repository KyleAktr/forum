"use client";

import { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import { getUser, updateProfile, uploadProfilePicture, deleteAccount } from "@/services/auth";
import Image from "next/image";
import { getMyPosts, deletePost } from "@/services/post";
import { Post, Comment } from "@/types";
import { getUserComments, deleteComment } from "@/services/comments";
import LikeButton from "@/components/LikeButton";
import Link from "next/link";
import Footer from "@/components/Footer";
import { validatePassword, getPasswordErrorMessage } from "@/utils/validation";

interface UserProfile {
  id: number;
  username: string;
  email: string;
  city?: string;
  age?: number;
  bio?: string;
  profilePicture?: string;
}

export default function Page() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [myComments, setMyComments] = useState<Comment[]>([]);
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    password: "",
    city: "",
    age: "",
    bio: "",
  });
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");


  const fetchUserPosts = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token || !profile) return;

    try {
      const posts = await getMyPosts(token);
      setMyPosts(posts);
    } catch (err) {
      console.error("Erreur lors de la récupération des articles:", err);
      setError("Impossible de charger vos articles");
    }
  }, [profile]);

  const fetchUserComments = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token || !profile) return;

    try {
      const comments = await getUserComments(token);
      setMyComments(comments);
    } catch (err) {
      console.error("Erreur lors de la récupération des commentaires:", err);
      setError("Impossible de charger vos commentaires");
    }
  }, [profile]);

  useEffect(() => {
    const user = getUser();
    if (user) {
      setProfile(user);
      setEditForm({
        username: user.username || "",
        email: user.email || "",
        password: "",
        city: user.city || "",
        age: user.age?.toString() || "",
        bio: user.bio || "",
      });
    }
  }, []);

  useEffect(() => {
    if (profile) {
      fetchUserPosts();
      fetchUserComments();
    }
  }, [profile, fetchUserPosts, fetchUserComments]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editForm.password && !validatePassword(editForm.password)) {
      setPasswordError(getPasswordErrorMessage());
      return; 
    }
    
    try {
      const updatedUser = await updateProfile({
        username: editForm.username || undefined,
        email: editForm.email || undefined,
        password: editForm.password || undefined,
        city: editForm.city,
        age: parseInt(editForm.age) || 0,
        bio: editForm.bio,
      });
      setProfile(updatedUser);
      setIsEditing(false);
      setError("");
      setEditForm((prev) => ({ ...prev, password: "" }));
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Erreur lors de la mise à jour du profil");
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const pictureUrl = await uploadProfilePicture(file);
      setProfile((prev) =>
        prev ? { ...prev, profilePicture: pictureUrl } : null
      );
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Erreur lors de l'upload de l'image");
      }
    }
  };

  const handlePostUpdate = (updatedPost: Post) => {
    setMyPosts(
      myPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) return;
    try {
      await deleteAccount();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/"; 
    } catch {
      alert("Erreur lors de la suppression du compte");
    }
  };

  if (!profile) {
    return (
      <div>
        <Navbar />
        <div className="profile-container">
          <h1>Profil</h1>
          <p>Veuillez vous connecter pour voir votre profil.</p>
        </div>
      </div>
    );
  }

  const getFirstBlockFromHTML = (htmlString: string) => {
    if (typeof window === "undefined") return ""; // sécurité SSR
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const firstBlock = doc.body.firstElementChild;
    return firstBlock ? firstBlock.outerHTML : "";
  };

  return (
    <div>
      <Navbar />
      <div className="profile-container">
        {error && <p className="error-message">{error}</p>}

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
          <div className="profile-picture-upload">
            <input
              type="file"
              id="profile-picture"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <label htmlFor="profile-picture" className="upload-button">
              Changer la photo
            </label>

            <h3>{profile.username}</h3>
          </div>
        </div>

        <div className="profile-info">
          {!isEditing ? (
            <>
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
              <button
                // className="edit-button"
                onClick={() => setIsEditing(true)}
              >
                Modifier le profil
              </button>
              <button
          className="delete-account-btn"
          onClick={handleDeleteAccount}
        >
          Supprimer mon compte
        </button>
            </>
          ) : (
            <form onSubmit={handleEditSubmit} className="edit-form">
              <div className="form-group">
                <label htmlFor="username">Pseudo</label>
                <input
                  type="text"
                  id="username"
                  value={editForm.username}
                  onChange={(e) =>
                    setEditForm({ ...editForm, username: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">
                  Nouveau mot de passe (laisser vide pour ne pas changer)
                </label>
                <div className="password-field">
                <input
                  type="password"
                  id="password"
                  value={editForm.password}
                  onChange={(e) => {
                    const newPassword = e.target.value;
                    setEditForm({ ...editForm, password: newPassword });
                    
                    if (newPassword && !validatePassword(newPassword)) {
                      setPasswordError(getPasswordErrorMessage());
                    } else {
                      setPasswordError("");
                    }
                  }}
                />
                {passwordError && (
                  <div className="password-error">
                    {passwordError}
                  </div>
                )}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="city">Ville</label>
                <input
                  type="text"
                  id="city"
                  value={editForm.city}
                  onChange={(e) =>
                    setEditForm({ ...editForm, city: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="age">Âge</label>
                <input
                  type="number"
                  id="age"
                  value={editForm.age}
                  onChange={(e) =>
                    setEditForm({ ...editForm, age: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  value={editForm.bio}
                  onChange={(e) =>
                    setEditForm({ ...editForm, bio: e.target.value })
                  }
                  rows={4}
                />
              </div>
              <div className="form-buttons">
                <button type="submit">Enregistrer</button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    if (profile) {
                      setEditForm({
                        username: profile.username,
                        email: profile.email,
                        password: "",
                        city: profile.city || "",
                        age: profile.age?.toString() || "",
                        bio: profile.bio || "",
                      });
                    }
                  }}
                >
                  Annuler
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      
      <div className="user-content-container">
        <div className="user-posts">
          <h2>Mes publications</h2>
          {myPosts.length === 0 ? (
            <p>Vous n&apos;avez pas encore publié d&apos;article.</p>
          ) : (
            <ul className="posts-list">
              {[...myPosts]
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
                      <button 
                        className="edit-article-button"
                        onClick={() => {
                          localStorage.setItem('editArticleMode', 'true');
                          localStorage.setItem('editArticleId', post.id.toString());
                          window.location.href = `/article/${post.id}`;
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button 
                        className="delete-article-button"
                        onClick={() => {
                          if (window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
                            deletePost(post.id)
                              .then(() => {
                                setMyPosts(myPosts.filter(p => p.id !== post.id));
                              })
                              .catch(err => {
                                console.error("Erreur lors de la suppression:", err);
                                alert("Erreur lors de la suppression de l'article");
                              });
                          }
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </div>
        
        <div className="user-comments">
          <h2>Mes commentaires</h2>
          {myComments.length === 0 ? (
            <p>Vous n&apos;avez pas encore publié de commentaire.</p>
          ) : (
            <ul className="posts-list">
              {[...myComments]
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
                      <button 
                        className="delete-article-button"
                        onClick={async () => {
                          if (window.confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?")) {
                            try {
                              await deleteComment(comment.id);
                              setMyComments(myComments.filter(c => c.id !== comment.id));
                            } catch (err) {
                              console.error("Erreur lors de la suppression:", err);
                              setError("Impossible de supprimer le commentaire");
                            }
                          }
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
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

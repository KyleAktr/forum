"use client";

import { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import { getUser, updateProfile, uploadProfilePicture } from "@/services/auth";
import Image from "next/image";
import { getMyPosts } from "@/services/post";
import { Post } from "@/types";
import LikeButton from "@/components/LikeButton";
import { getPosts } from "@/services/post";
import Link from "next/link";
import Footer from "@/components/Footer";
import TiptapEditor from "@/components/TiptapEditor";
import EditPost from "@/components/EditPost";

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
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    password: "",
    city: "",
    age: "",
    bio: "",
  });
  const [error, setError] = useState("");
  const [editingPost, setEditingPost] = useState<Post | null>(null);

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
    }
  }, [profile, fetchUserPosts]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  const handlePostEdit = (post: Post) => {
    setEditingPost(post);
  };

  const handlePostSaved = (updatedPost: Post) => {
    setMyPosts(
      myPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
    setEditingPost(null);
  };

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
                <input
                  type="password"
                  id="password"
                  value={editForm.password}
                  onChange={(e) =>
                    setEditForm({ ...editForm, password: e.target.value })
                  }
                />
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
              .map((post: any) => (
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
                        post.user.profilePicture.startsWith("http")
                          ? post.user.profilePicture
                          : `http://localhost:8080${post.user.profilePicture}`
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
                        Voir l'article
                      </button>
                    </Link>
                    <button 
                      className="edit-button"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePostEdit(post);
                      }}
                    >
                      Modifier
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>
      {editingPost && (
        <EditPost
          post={editingPost}
          onClose={() => setEditingPost(null)}
          onSave={handlePostSaved}
        />
      )}
      <Footer />
    </div>
  );
}

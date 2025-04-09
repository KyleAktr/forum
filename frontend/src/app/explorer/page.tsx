"use client";

import Navbar from "@/components/Navbar";
import { getPosts } from "@/services/post";
import { useEffect, useState } from "react";

export default function page() {
  const [Posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts()
      .then(setPosts)
      .catch((err) => console.error("Erreur lors du fetch des posts", err));
  }, []);

  return (
    <div>
      <Navbar />
      <div className="explorer">
        <h1>Explorer</h1>
        <p>Bienvenue sur la page d'exploration !</p>
        <p>Vous pouvez explorer les articles et les catégories ici.</p>
        <p>Utilisez le menu pour naviguer vers d'autres sections.</p>
      </div>
      <div className="user-posts">
        <h2>Tous les articles</h2>
        {Posts.length === 0 ? (
          <p>Vous n'avez pas encore publié d'article.</p>
        ) : (
          <ul className="post-list">
            {Posts.map((post: any) => (
              <li key={post.id} className="post-card">
                <h3>{post.title}</h3>
                <p>{post.content.slice(0, 100)}...</p>
                <p className="meta">
                  Posté le {new Date(post.created_at).toLocaleDateString()} par{" "}
                  {post.user.username}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

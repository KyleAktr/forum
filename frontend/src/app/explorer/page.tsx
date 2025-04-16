"use client";

import Navbar from "@/components/Navbar";
import { getPosts } from "@/services/post";
import { useEffect, useState } from "react";
import LikeButton from "@/components/LikeButton";
import { Post } from "@/types";
import Link from "next/link";

export default function Page() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    getPosts()
      .then(setPosts)
      .catch((err) => console.error("Erreur lors du fetch des posts", err));
  }, []);

  const handlePostUpdate = (updatedPost: Post) => {
    setPosts(posts.map(post => post.id === updatedPost.id ? updatedPost : post));
  };

  return (
    <div>
      <Navbar />
      <div className="explorer">
        <h1>Explorer</h1>
        <p>Bienvenue sur la page d&apos;exploration !</p>
        <p>Vous pouvez explorer les articles et les catégories ici.</p>
        <p>Utilisez le menu pour naviguer vers d&apos;autres sections.</p>
      </div>
      <div className="user-posts">
        <h2>Tous les articles</h2>
        {posts.length === 0 ? (
          <p>Aucun article n&apos;a été publié.</p>
        ) : (
          <ul className="post-list">
            {posts.map((post: Post) => (
              <li key={post.id} className="post-card">
                <Link href={`/article/${post.id}`}>
                  <h3>{post.title}</h3>
                </Link>
                <p>{post.content.slice(0, 100)}...</p>
                <p className="meta">
                  Posté le {new Date(post.created_at).toLocaleDateString()} par{" "}
                  {post.user.username}
                </p>
                <LikeButton 
                  post={post} 
                  onReactionUpdate={handlePostUpdate} 
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

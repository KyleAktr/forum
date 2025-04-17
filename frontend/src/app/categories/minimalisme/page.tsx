"use client";

import Navbar from "@/components/Navbar";
import Image from "next/image";
import teletravailHeader from "../../../static/img/bg-3.jpg";
import { useEffect, useState } from "react";
import Link from "next/link";
import LikeButton from "@/components/LikeButton";
import { getPosts } from "@/services/post";
import { Post } from "@/types";

export default function page() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(`http://localhost:8080/api/posts?category_id=2`);
      const data = await res.json();
      setPosts(data.data);
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    getPosts()
      .then(setPosts)
      .catch((err) => console.error("Erreur lors du fetch des posts", err));
  }, []);

  const handlePostUpdate = (updatedPost: Post) => {
    setPosts(
      posts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  };

  return (
    <div>
      <Navbar />
      <header className="header-categorie">
        <Image
          src={teletravailHeader}
          alt="Image représentant une femme dans l'eau"
          className="header-categorie-img"
        />
        <h1>Minimalisme et frugalité</h1>
      </header>
      <div className="body-categorie">
        <div className="filtres">
          <h2>Filtres</h2>
          <ul className="filtres-list">
            <li>Filtres 1</li>
            <li>Filtres 2</li>
            <li>Filtres 3</li>
          </ul>
        </div>
        <ul className="posts-list">
          {posts.map((post: any) => (
            <li key={post.id} className="post-item">
              <h3>{post.title}</h3>
              <p>{post.content.slice(0, 100)}...</p>
              <p className="meta">
                Posté le {new Date(post.created_at).toLocaleDateString()} par{" "}
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
                <LikeButton post={post} onReactionUpdate={handlePostUpdate} />
                <Link href={`/article/${post.id}`}>
                  <button className="view-article-button">
                    Voir l'article
                  </button>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

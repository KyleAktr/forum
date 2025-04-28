"use client";

import LikeButton from "@/components/LikeButton";
import Navbar from "@/components/Navbar";
import { Post } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function page() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    const fetchPosts = async () => {
      setLoading(true);
      const res = await fetch(
        `http://localhost:8080/api/posts?search=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setPosts(data.data);
      setLoading(false);
    };

    fetchPosts();
  }, [query]);

  const handlePostUpdate = (updatedPost: Post) => {
    setPosts(
      posts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  };

  const getFirstBlockFromHTML = (htmlString: string) => {
    if (typeof window === "undefined") return ""; // sécurité SSR
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const firstBlock = doc.body.firstElementChild;
    return firstBlock ? firstBlock.outerHTML : "";
  };

  return (
    <div className="search-page">
      <Navbar />
      <h1>Résultats de recherche pour : {query}</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : posts.length > 0 ? (
        <ul className="posts-list">
          {[...posts]
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
      ) : (
        <p>Aucun résultat trouvé.</p>
      )}
    </div>
  );
}

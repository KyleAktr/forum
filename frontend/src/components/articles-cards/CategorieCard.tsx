import { Post } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import LikeButton from "../LikeButton";
import { FaRegComment } from "react-icons/fa";
import { TbArrowNarrowUp, TbArrowNarrowDown } from "react-icons/tb";

type Props = {
  categoryId: number;
};

export default function CategorieCard({ categoryId }: Props) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [sort, setSort] = useState<string>("recent");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    const fetchPosts = async () => {
      try {
        const sortParam =
          sort === "recent"
            ? `created_at:${sortOrder}`
            : `${sort}:${sortOrder}`;
        const res = await fetch(
          `http://localhost:8080/api/posts?category_id=${categoryId}&sort=${sortParam}`
        );

        const data = await res.json();
        setPosts(data.data);
      } catch (err) {
        console.error("Erreur lors du fetch des posts par catégorie", err);
      }
    };

  useEffect(() => {
    fetchPosts();
  }, [categoryId, sort, sortOrder]);

  const sortLabels = {
    recent: "Date",
    likes: "Nombre de likes",
    comments: "Nombre de commentaires",
  };

  const handlePostUpdate = async (updatedPost: Post) => {
    setPosts(
      posts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
    if (sort === "likes") {
      await fetchPosts();
    }
  };

  const handleSortClick = (type: string) => {
    if (type === sort) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSort(type);
      setSortOrder("desc");
    }
  };

  const getFirstBlockFromHTML = (htmlString: string) => {
    if (typeof window === "undefined") return ""; // sécurité SSR
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const firstBlock = doc.body.firstElementChild;
    return firstBlock ? firstBlock.outerHTML : "";
  };

  return (
    // <div>
    <div className="body-categorie">
      <div className="filtres">
        <h3>Filtres</h3>
        {Object.entries(sortLabels).map(([type, label]) => (
          <button
            key={type}
            onClick={() => handleSortClick(type)}
            className={sort === type ? "active" : ""}
          >
            {label} {sort === type && (sortOrder === "asc" ? <TbArrowNarrowUp /> : <TbArrowNarrowDown />)}
          </button>
        ))}
      </div>

      <ul className="posts-list">
        {posts.map((post) => (
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
                <Link href={`/profil/${post.user.id}`} className="author-link">
                  {post.user ? post.user.username : "Inconnu"}{" "}
                </Link>
              )}
              {post.user && post.user.profilePicture && (
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
              )}
            </p>
            <div className="post-actions">
              <div className="post-reactions">
                <LikeButton post={post} onReactionUpdate={handlePostUpdate} />
                <FaRegComment />
                <p>{post.comments?.length || 0}</p>
              </div>
              <Link href={`/article/${post.id}`}>
                <button className="view-article-button">Voir l&apos;article</button>
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

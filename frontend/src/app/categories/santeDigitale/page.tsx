"use client";

import Navbar from "@/components/Navbar";
import Image from "next/image";
import teletravailHeader from "../../../static/img/bg-2.jpg";
import { useEffect, useState } from "react";

export default function page() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(`http://localhost:8080/api/posts?category_id=3`);
      const data = await res.json();
      setPosts(data.data);
    };

    fetchPosts();
  }, []);
  return (
    <div>
      <Navbar />
      <header className="header-categorie">
        <Image
          src={teletravailHeader}
          alt="Image représentant une femme dans l'eau"
          className="header-categorie-img"
        />
        <h1>Santé mentale et digitale</h1>
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
              <p>{post.content}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { isAuthenticated, logout, getUser } from "@/services/auth";
import SearchBar from "./SearchBar";
import { Post } from "@/types";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    const auth = isAuthenticated();
    setAuthenticated(auth);
    if (auth) {
      const user = getUser();
      if (user) {
        setUsername(user.username);
      }
    }
  }, []);

  const handleSearch = (term: string) => {
    if (term.trim() !== "") {
      router.push(`/search?query=${encodeURIComponent(term)}`);
    }
  };

  return (
    <div className="navbar">
      {authenticated ? (
        <nav>
          <div className="logo">
            <a href="/">HAVEN</a>
          </div>
          <div className="ancres">
            <SearchBar onSearch={handleSearch} />
            <a href="/categories">Catégories</a>
            <a href="/creation-article">Créer</a>
            <a href ="/network">Réseau</a>
            <a href="/contact">Contact</a>
            <a href="/profil">Profil</a>
            <button onClick={logout}>DÉCONNEXION</button>
          </div>
        </nav>
      ) : (
        <nav>
          <div className="logo">
            <a href="/">HAVEN</a>
          </div>
          <div className="ancres">
            <a href="/categories">Catégories</a>
            <a href ="/network">Réseau</a>
            <a href="/contact">Contact</a>
            <a href="/login">connexion</a>
            <a href="/register">s'inscrire</a>
          </div>
        </nav>
      )}
    </div>
  );
}

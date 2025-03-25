"use client";
import { useEffect, useState } from "react";
import { isAuthenticated, logout, getUser } from "@/services/auth";

export default function Navbar() {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState("");

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

  return (
    <div className="navbar">
      {authenticated ? (
        <nav>
          <div className="logo">
            <a href="/">Island°</a>
          </div>
          <div className="ancres">
            <a href="/categories">Catégories</a>
            <a href="/articles">Explorer</a>
            <a href="/creation-article">Créer</a>
            <a href="/contact">Contact</a>
            <a href="/profil">Profil</a>
            <button onClick={logout}>Déconnexion</button>
          </div>
        </nav>
      ) : (
        <nav>
          <div className="logo">
            <a href="/">Island°</a>
          </div>
          <div className="ancres">
            <a href="/contact">Contact</a>
            <a href="/login">connexion</a>
            <a href="/register">s'inscrire</a>
          </div>
        </nav>
      )}
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { isAuthenticated, logout, getUser } from "@/services/auth";
import SearchBar from "./SearchBar";
import { useRouter } from "next/navigation";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

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
      <nav>
        <div className="logo">
          <a href="/">HAVEN</a>
        </div>

        <div className="hamburger" onClick={toggleMenu}>
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </div>

        <div className={`ancres ${menuOpen ? "open" : ""}`}>
          {authenticated ? (
            <>
              <SearchBar onSearch={handleSearch} />
              <a href="/categories">Catégories</a>
              <a href="/creation-article">Créer</a>
              <a href="/network">Réseau</a>
              <a href="/contact">Contact</a>
              <a href="/profil">Profil</a>
              <button onClick={logout}>DÉCONNEXION</button>
            </>
          ) : (
            <>
              <a href="/categories">Catégories</a>
              <a href="/network">Réseau</a>
              <a href="/contact">Contact</a>
              <a href="/login">connexion</a>
              <a href="/register">s'inscrire</a>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}

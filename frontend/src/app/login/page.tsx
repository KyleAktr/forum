"use client";
import { useState } from "react";
import { login } from "@/services/auth";
import Navbar from "@/components/Navbar";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const [error, setError] = useState("");
  const [loginInput, setLoginInput] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      await login(
        loginInput,
        formData.get("password") as string
      );
      window.location.href = "/";
    } catch {
      setError("Email ou mot de passe incorrect");
    }
  };

  return (
    <div className="login">
      <Navbar />
      <div className="login-container">
        <h1>CONNEXION</h1>
        <a href="/register">Pas encore inscrit ?</a>
        <form onSubmit={handleSubmit}>
          {error && <div style={{ color: "red" }}>{error}</div>}
          <div>
            <input
              type="text"
              value={loginInput}
              onChange={e => setLoginInput(e.target.value)}
              placeholder="Email ou nom d'utilisateur"
              required
            />
          </div>
          <div>
            <input
              name="password"
              type="password"
              placeholder="Mot de passe"
              required
            />
          </div>
          <button type="submit">Se connecter</button>
          <div className="google">
            <a href="http://localhost:8080/api/auth/google" className="google-btn">
              <FcGoogle size={30} />
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

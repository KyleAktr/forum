"use client";
import { useState } from "react";
import { register } from "@/services/auth";
import Navbar from "@/components/Navbar";
import { FcGoogle } from "react-icons/fc";

export default function Register() {
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      await register(
        formData.get("username") as string,
        formData.get("email") as string,
        formData.get("password") as string
      );
      window.location.href = "/";
    } catch {
      setError("Erreur lors de l'inscription, veuillez réessayer plus tard");
    }
  };

  return (
    <div className="login">
      <Navbar />
      <div className="login-container">
        <h1>Inscription</h1>
        <a href="/login">Déjà inscrit ?</a>
        <form onSubmit={handleSubmit}>
          {error && <div style={{ color: "red" }}>{error}</div>}
          <div>
            <input
              name="username"
              type="text"
              placeholder="Username"
              required
            />
          </div>
          <div>
            <input name="email" type="email" placeholder="Email" required />
          </div>
          <div>
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
            />
          </div>
          <button type="submit">S&apos;inscrire</button>
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

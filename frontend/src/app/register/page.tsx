"use client";
import { useState } from "react";
import { register } from "@/services/auth";
import Navbar from "@/components/Navbar";
import { FcGoogle } from "react-icons/fc";
import { getPasswordErrorMessage } from "@/utils/validation";
import { validatePassword } from "@/utils/validation";

export default function Register() {
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    if (password && !validatePassword(password)) {
      setPasswordError(getPasswordErrorMessage());
    } else {
      setPasswordError("");
    }
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;

    if (!validatePassword(password)) {
      setPasswordError(getPasswordErrorMessage());
      return;
    }

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
              placeholder="Nom d'utilisateur"
              required
            />
          </div>
          <div>
            <input name="email" type="email" placeholder="Email" required />
          </div>
          <div className="password-field">
            <input
              name="password"
              type="password"
              placeholder="Mot de passe"
              onChange={handlePasswordChange}
              required
              style={passwordError ? { borderColor: "red" } : {}}
            />
            {passwordError && <div className="password-error">{passwordError}</div>}
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

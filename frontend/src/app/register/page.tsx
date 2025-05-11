"use client";
import { useState } from "react";
import { register } from "@/services/auth";
import Navbar from "@/components/Navbar";
import { FcGoogle } from "react-icons/fc";
import { getPasswordErrorMessage, validatePassword } from "@/utils/validation";

export default function Register() {
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [password, setPassword] = useState("");

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    
    if (newPassword && !validatePassword(newPassword)) {
      setPasswordError(getPasswordErrorMessage());
    } else {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const confirmPassword = e.target.value;
    
    if (confirmPassword !== password) {
      setConfirmPasswordError("Les mots de passe ne correspondent pas");
    } else {
      setConfirmPasswordError("");
    }
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!validatePassword(password)) {
      setPasswordError(getPasswordErrorMessage());
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      await register(
        formData.get("username") as string,
        formData.get("email") as string,
        password
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
        <h1>INSCRIPTION</h1>
        <a href="/login">Déjà inscrit ?</a>
        
        <form onSubmit={handleSubmit}>
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
          </div>
          <div className="password-field">
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirmer le mot de passe"
              onChange={handleConfirmPasswordChange}
              required
              style={confirmPasswordError ? { borderColor: "red" } : {}}
            />
          </div>
          
          <div className="error-messages">
            {error && <div className="global-error">{error}</div>}
            {passwordError && <div className="field-error">{passwordError}</div>}
            {confirmPasswordError && <div className="field-error">{confirmPasswordError}</div>}
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

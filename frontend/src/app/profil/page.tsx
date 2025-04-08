"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { getUser, updateProfile, uploadProfilePicture } from "@/services/auth";
import Image from "next/image";

interface UserProfile {
  id: number;
  username: string;
  email: string;
  city?: string;
  age?: number;
  bio?: string;
  profilePicture?: string;
}

export default function Page() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    password: "",
    city: "",
    age: "",
    bio: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const user = getUser();
    if (user) {
      setProfile(user);
      setEditForm({
        username: user.username || "",
        email: user.email || "",
        password: "",
        city: user.city || "",
        age: user.age?.toString() || "",
        bio: user.bio || "",
      });
    }
  }, []);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedUser = await updateProfile({
        username: editForm.username || undefined,
        email: editForm.email || undefined,
        password: editForm.password || undefined,
        city: editForm.city,
        age: parseInt(editForm.age) || 0,
        bio: editForm.bio,
      });
      setProfile(updatedUser);
      setIsEditing(false);
      setError("");
      setEditForm(prev => ({ ...prev, password: "" }));
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Erreur lors de la mise à jour du profil");
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const pictureUrl = await uploadProfilePicture(file);
      setProfile(prev => prev ? {...prev, profilePicture: pictureUrl} : null);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Erreur lors de l'upload de l'image");
      }
    }
  };

  if (!profile) {
    return (
      <div>
        <Navbar />
        <div className="profile-container">
          <h1>Profil</h1>
          <p>Veuillez vous connecter pour voir votre profil.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="profile-container">
        <h1>Profil</h1>
        {error && <p className="error-message">{error}</p>}
        
        <div className="profile-picture-container">
          <div className="profile-picture-wrapper">
            {profile.profilePicture ? (
              <Image
                src={`http://localhost:8080${profile.profilePicture}`}
                alt="Photo de profil"
                width={150}
                height={150}
                className="profile-picture"
                unoptimized
              />
            ) : (
              <div className="profile-picture-placeholder">
                {profile.username[0].toUpperCase()}
              </div>
            )}
          </div>
          <div className="profile-picture-upload">
            <input
              type="file"
              id="profile-picture"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <label htmlFor="profile-picture" className="upload-button">
              Changer la photo
            </label>
          </div>
        </div>

        <div className="profile-info">
          {!isEditing ? (
            <>
              <div className="info-group">
                <h3>Pseudo</h3>
                <p>{profile.username}</p>
              </div>
              <div className="info-group">
                <h3>Email</h3>
                <p>{profile.email}</p>
              </div>
              <div className="info-group">
                <h3>Ville</h3>
                <p>{profile.city || "Non renseigné"}</p>
              </div>
              <div className="info-group">
                <h3>Âge</h3>
                <p>{profile.age || "Non renseigné"}</p>
              </div>
              <div className="info-group">
                <h3>Bio</h3>
                <p>{profile.bio || "Non renseigné"}</p>
              </div>
              <button className="edit-button" onClick={() => setIsEditing(true)}>
                Modifier le profil
              </button>
            </>
          ) : (
            <form onSubmit={handleEditSubmit} className="edit-form">
              <div className="form-group">
                <label htmlFor="username">Pseudo</label>
                <input
                  type="text"
                  id="username"
                  value={editForm.username}
                  onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Nouveau mot de passe (laisser vide pour ne pas changer)</label>
                <input
                  type="password"
                  id="password"
                  value={editForm.password}
                  onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="city">Ville</label>
                <input
                  type="text"
                  id="city"
                  value={editForm.city}
                  onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="age">Âge</label>
                <input
                  type="number"
                  id="age"
                  value={editForm.age}
                  onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="form-buttons">
                <button type="submit">Enregistrer</button>
                <button type="button" onClick={() => {
                  setIsEditing(false);
                  if (profile) {
                    setEditForm({
                      username: profile.username,
                      email: profile.email,
                      password: "",
                      city: profile.city || "",
                      age: profile.age?.toString() || "",
                      bio: profile.bio || "",
                    });
                  }
                }}>
                  Annuler
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

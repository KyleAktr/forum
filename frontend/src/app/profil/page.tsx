"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { getUser, updateProfile } from "@/services/auth";

interface UserProfile {
  id: number;
  username: string;
  email: string;
  city?: string;
  age?: number;
  bio?: string;
}

export default function Page() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
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
        city: editForm.city,
        age: parseInt(editForm.age) || 0,
        bio: editForm.bio,
      });
      setProfile(updatedUser);
      setIsEditing(false);
      setError("");
    } catch {
      setError("Erreur lors de la mise à jour du profil");
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
        
        <div className="profile-info">
          <div className="info-group">
            <h3>Pseudo</h3>
            <p>{profile.username}</p>
          </div>
          <div className="info-group">
            <h3>Email</h3>
            <p>{profile.email}</p>
          </div>

          {!isEditing ? (
            <>
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
                <button type="button" onClick={() => setIsEditing(false)}>
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

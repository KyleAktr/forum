"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Image from "next/image";

type UserProfile = {
  id: number;
  username: string;
  email: string;
  city?: string;
  age?: number;
  bio?: string;
  profilePicture?: string;
};

export default function PublicProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("User ID from URL:", id);

    const fetchUser = async () => {
      const token = localStorage.getItem("token"); // ou tout autre moyen d'obtenir ton token

      try {
        const res = await fetch(`http://localhost:8080/api/user/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Utilisateur introuvable");
        const json = await res.json();
        setProfile(json.data);
      } catch (err) {
        console.error(err);
        // setError(err.message || "Erreur lors de la récupération du profil");
      }
    };

    if (id) fetchUser();
  }, [id]);

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="profile-container">
          <h1>Erreur</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div>
        <Navbar />
        <div className="profile-container">
          <h1>Chargement...</h1>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="profile-container">
        <div className="profile-picture-container">
          <div className="profile-picture-wrapper">
            {profile.profilePicture ? (
              <Image
                src={
                  profile.profilePicture.startsWith("http")
                    ? profile.profilePicture
                    : `http://localhost:8080${profile.profilePicture}`
                }
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
          <h3>{profile.username}</h3>
        </div>

        <div className="profile-info">
          <h2>Infos</h2>
          <div className="info-group">
            <h3>
              Email : <span>{profile.email}</span>
            </h3>
          </div>
          <div className="info-group">
            <h3>
              Ville : <span>{profile.city || "Non renseigné"}</span>
            </h3>
          </div>
          <div className="info-group">
            <h3>
              Âge : <span>{profile.age || "Non renseigné"}</span>
            </h3>
          </div>
          <div className="info-group">
            <h3>
              Bio : <span>{profile.bio || "Non renseigné"}</span>
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { User } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchInput, setSearchInput] = useState("");
  
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch(`http://localhost:8080/api/users`);
      const data = await res.json();
      setUsers(data.data);
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div className="network">
      <Navbar />
      <div className="network-header">
        <h1>RÉSEAU</h1>
        <p>
          Découvrez les autres utilisateurs de notre site et connectez-vous avec eux.
        </p>
      </div>
      
      <div className="search-user">
        <input
          type="text"
          placeholder="Rechercher un utilisateur"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      <div className="network-list">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div key={user.id} className="network-card">
              <Image
              src={
                user.profilePicture?.startsWith("http")
                  ? user.profilePicture
                  : `http://localhost:8080${user.profilePicture || ""}`
              }
              alt="Photo de profil"
              width={150}
              height={150}
              className="profile-picture"
              unoptimized
            />
            <Link href={`/profil/${user.id}`} className="author-link">
              {user ? user.username : "Inconnu"}{" "}
            </Link>
          </div>
        ))
      ) : (
        <div className="no-results">
          <p>Aucun utilisateur ne correspond à votre recherche</p>
        </div>
      )}
      </div>
      <Footer />
    </div>
  );
}

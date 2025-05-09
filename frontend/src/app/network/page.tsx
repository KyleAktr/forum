"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function page() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch(`http://localhost:8080/api/users`);
      const data = await res.json();
      setUsers(data.data);
    };
    fetchUsers();
  }, []);

  return (
    <div className="network">
      <Navbar />

      <div className="network-list">
        {users.map((user: any) => (
          <div key={user.id} className="network-card">
            <Image
              src={
                user.profilePicture.startsWith("http")
                  ? user.profilePicture
                  : `http://localhost:8080${user.profilePicture}`
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
        ))}
      </div>
      <Footer />
    </div>
  );
}

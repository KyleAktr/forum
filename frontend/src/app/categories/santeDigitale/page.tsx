"use client";

import Navbar from "@/components/Navbar";
import Image from "next/image";
import teletravailHeader from "../../../static/img/bg-2.jpg";
import CategorieCard from "@/components/articles-cards/CategorieCard";
import Footer from "@/components/Footer";

export default function page() {
  return (
    <div>
      <Navbar />
      <header className="header-categorie">
        <Image
          src={teletravailHeader}
          alt="Image représentant une femme dans l'eau"
          className="header-categorie-img"
        />
        <h1>SANTÉ MENTALE ET DIGITALE</h1>
      </header>
      <CategorieCard categoryId={3} />
      <Footer />
    </div>
  );
}

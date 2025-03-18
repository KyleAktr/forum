import Navbar from "@/components/Navbar";
import type { Metadata } from "next";
import homePageImage from "../static/img/home-page-image.png";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Forum - Accueil",
  description: "Page d'accueil",
};

export default function Home() {
  return (
    <div>
      <Navbar />

      <header className="header">
        {/* Image en arrière-plan */}
        <Image
          src={homePageImage}
          alt="Image"
          className="header-img"
          layout="fill"
          objectFit="cover"
        />

        {/* Contenu au-dessus de l'image */}
        <div className="header-content">
          <h1>Island°</h1>
          <h2>Faites vivre vos pensées</h2>
          <p>Exprimez-vous, réagissez, inspirez-vous</p>
          <button>Commencer</button>
        </div>
      </header>
    </div>
  );
}

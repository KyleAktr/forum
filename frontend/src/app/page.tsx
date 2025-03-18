import Navbar from "@/components/Navbar";
import type { Metadata } from "next";
import homePageImage from "../static/img/home-page-image.png";
import lifestyle from "../static/img/lifestyle.png";
import minimalisme from "../static/img/minimalisme.png";
import santeDigitale from "../static/img/sante-digitale.png";
import teletravail from "../static/img/teletravail.png";
import Image from "next/image";
import { TfiWrite } from "react-icons/tfi";
import { FaRegCommentDots } from "react-icons/fa";
import { FaRegLightbulb } from "react-icons/fa";
import { FaArrowAltCircleRight } from "react-icons/fa";

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
      <div className="body">
        <h3>
          Votre mode de vie et votre environnement influent sur chaque élément
          de votre vie. Devenez maitre de chaque instant{" "}
        </h3>
        <div className="explain-cards">
          <div className="explain-card">
            <TfiWrite size={30} />
            <h4>Partagez</h4>
            <p>
              Partagez vos pensées, vos idées, vos expériences et vos
              connaissances avec le monde entier
            </p>
          </div>
          <div className="explain-card">
            <FaRegLightbulb size={30} />
            <h4>Apprenez</h4>
            <p>
              Apprenez de nouvelles choses, découvrez de nouvelles cultures et
              de nouvelles idées
            </p>
          </div>
          <div className="explain-card">
            <FaRegCommentDots size={30} />
            <h4>Interagissez</h4>
            <p>
              Dites ce que vous pensez sur les sujets qui vous tiennent à coeur{" "}
            </p>
          </div>
        </div>
        <h2>On parle de quoi ?</h2>
        <div className="category-cards">
          <div className="category-card">
            <Image src={teletravail} alt="Image" className="category-image" />
            <h4>Travail hybride et télétravail</h4>
            <div className="card-footer">
              <p>26 discussions</p>
              <FaArrowAltCircleRight size={30} className="arrow-icon" />
            </div>
          </div>

          <div className="category-card">
            <Image src={minimalisme} alt="Image" className="category-image" />
            <h4>Minimalisme et frugalité</h4>
            <div className="card-footer">
              <p>14 discussions</p>
              <FaArrowAltCircleRight size={30} className="arrow-icon" />
            </div>
          </div>

          <div className="category-card">
            <Image src={santeDigitale} alt="Image" className="category-image" />
            <h4>Santé mentale et digitale</h4>
            <div className="card-footer">
              <p>19 discussions</p>
              <FaArrowAltCircleRight size={30} className="arrow-icon" />
            </div>
          </div>

          <div className="category-card">
            <Image src={lifestyle} alt="Image" className="category-image" />
            <h4>Lifestyle durable</h4>
            <div className="card-footer">
              <p>37 discussions</p>
              <FaArrowAltCircleRight size={30} className="arrow-icon" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

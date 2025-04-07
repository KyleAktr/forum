"use client";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import teletravail from "../../static/img/teletravail-header.jpg";
import { useState } from "react";
import { Upload, X } from "lucide-react";

export default function page() {
  const [image, setImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div>
      <Navbar />
      <header>
        <h1>Créer un article</h1>
      </header>
      <body>
        <form action="">
          <label htmlFor="">Titre : </label>
          <input type="text" name="" id="" placeholder="titre de l'article" />
          <br />
          <label htmlFor="">Catégorie :</label>
          <div className="create-article-categories-cards">
            <div className="create-article-categories-card">
              <Image
                className="create-article-img"
                src={teletravail}
                alt="image qui représente le télétravail"
              />
              <h4>Télétravail</h4>
            </div>
            <div className="create-article-categories-card">
              <Image
                className="create-article-img"
                src={teletravail}
                alt="image qui représente le télétravail"
              />
              <h4>Minimalisme et frugalité</h4>
            </div>
            <div className="create-article-categories-card">
              <Image
                className="create-article-img"
                src={teletravail}
                alt="image qui représente le télétravail"
              />
              <h4>Santé mentale digitale</h4>
            </div>
            <div className="create-article-categories-card">
              <Image
                className="create-article-img"
                src={teletravail}
                alt="image qui représente le télétravail"
              />
              <h4>Lifestyle durable</h4>
            </div>
          </div>
          <div className="">
            <label className="">
              {/* <Upload className="" /> */}
              <span className="">
                Choisir une image pour la banière de l'article
              </span>
              <br />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
            {image && (
              <div className="relative">
                <img src={image} alt="Aperçu" className="" />
                <button className="" onClick={removeImage}>
                  <X className="w-4 h-4 text-red-500" />
                </button>
              </div>
            )}
          </div>
          <label htmlFor="">Contenu de l'article</label>
          <br />
          <textarea name="" id=""></textarea>
          <br />
          <button type="submit">Publier l'article</button>
        </form>
      </body>
    </div>
  );
}

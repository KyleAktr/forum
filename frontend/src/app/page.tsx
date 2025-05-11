"use client";

import Navbar from "@/components/Navbar";
import lifestyle from "../static/img/lifestyle.png";
import minimalisme from "../static/img/minimalisme.png";
import santeDigitale from "../static/img/sante-digitale.png";
import teletravail from "../static/img/teletravail.png";
import Image from "next/image";
import { TfiWrite } from "react-icons/tfi";
import { FaRegCommentDots } from "react-icons/fa";
import { FaRegLightbulb } from "react-icons/fa";
import { FaArrowAltCircleRight } from "react-icons/fa";
import Footer from "@/components/Footer";
import HeaderHome from "@/components/HeaderHome";
import { useState, useEffect } from "react";
import { Post } from "@/types";

export default function Home() {
  const [categoryPostCounts, setCategoryPostCounts] = useState({
    teletravail: 0,
    minimalisme: 0,
    santeDigitale: 0,
    lifestyle: 0
  });

  useEffect(() => {
    const fetchCategoryCounts = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/posts');
        const data = await response.json();
        
        const counts = {
          teletravail: 0,
          minimalisme: 0,
          santeDigitale: 0,
          lifestyle: 0
        };
        
        data.data.forEach((post: Post) => {
          if (post.category) {
            switch (post.category.id) {
              case 1:
                counts.teletravail++;
                break;
              case 2:
                counts.minimalisme++;
                break;
              case 3:
                counts.santeDigitale++;
                break;
              case 4:
                counts.lifestyle++;
                break;
            }
          }
        });
        
        setCategoryPostCounts(counts);
      } catch (error) {
        console.error("Erreur lors de la récupération des posts:", error);
      }
    };

    fetchCategoryCounts();
  }, []);

  return (
    <div>
      <Navbar />

      <HeaderHome />
      
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
              <p>{categoryPostCounts.teletravail} discussion{categoryPostCounts.teletravail > 1 ? 's' : ''}</p>
              <a href="/categories/teletravail">
                <FaArrowAltCircleRight size={30} className="arrow-icon" />
              </a>
            </div>
          </div>

          <div className="category-card">
            <Image src={minimalisme} alt="Image" className="category-image" />
            <h4>Minimalisme et frugalité</h4>
            <div className="card-footer">
              <p>{categoryPostCounts.minimalisme} discussion{categoryPostCounts.minimalisme > 1 ? 's' : ''}</p>
              <a href="/categories/minimalisme">
                <FaArrowAltCircleRight size={30} className="arrow-icon" />
              </a>
            </div>
          </div>

          <div className="category-card">
            <Image src={santeDigitale} alt="Image" className="category-image" />
            <h4>Santé mentale et digitale</h4>
            <div className="card-footer">
              <p>{categoryPostCounts.santeDigitale} discussion{categoryPostCounts.santeDigitale > 1 ? 's' : ''}</p>
              <a href="/categories/santeDigitale">
                <FaArrowAltCircleRight size={30} className="arrow-icon" />
              </a>
            </div>
          </div>

          <div className="category-card">
            <Image src={lifestyle} alt="Image" className="category-image" />
            <h4>Lifestyle durable</h4>
            <div className="card-footer">
              <p>{categoryPostCounts.lifestyle} discussion{categoryPostCounts.lifestyle > 1 ? 's' : ''}</p>
              <a href="/categories/lifestyle">
                <FaArrowAltCircleRight size={30} className="arrow-icon" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

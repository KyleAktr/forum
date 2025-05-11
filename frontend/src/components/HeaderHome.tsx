"use client";
import Image from "next/image";
import homePageImage from "../static/img/home-page-image.png";

export default function HeaderHome() {
  const handleScroll = () => {
    const bodySection = document.querySelector('.body');
    if (bodySection) {
      bodySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="header">
      <Image
        src={homePageImage}
        alt="Image"
        className="header-img"
        layout="fill"
        objectFit="cover"
      />
      <div className="header-content">
        <h1>haven</h1>
        <h2>
          Un souffle nouveau
          <br />
          sur nos manières de vivre.
        </h2>
        <button onClick={handleScroll}>
          On en parle ?
        </button>
      </div>
    </header>
  );
} 
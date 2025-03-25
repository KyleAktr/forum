import Navbar from "@/components/Navbar";
import Image from "next/image";
import teletravailHeader from "../../../static/img/teletravail-header.jpg";

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
      </header>
      <h1>Télétravail</h1>
    </div>
  );
}

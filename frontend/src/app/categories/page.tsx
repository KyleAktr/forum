import Navbar from "@/components/Navbar";
import lifestyle from "../../static/img/lifestyle.png";
import minimalisme from "../../static/img/minimalisme.png";
import santeDigitale from "../../static/img/sante-digitale.png";
import teletravail from "../../static/img/teletravail.png";
import Image from "next/image";
import Link from "next/link";

export default function categories() {
  return (
    <div className="categories">
      <Navbar />
      <div className="categories-cards">
        <Link href="/categories/teletravail">
          <div className="categorie-card">
            <Image
              src={teletravail}
              alt="Image"
              className="categorie-card-image"
            />
          </div>
        </Link>
        <Link href="/categories/minimalisme">
          <div className="categorie-card">
            <Image
              src={minimalisme}
              className="categorie-card-image"
              alt="Image"
            />
            <p className="categorie-text">minimalisme</p>
          </div>
        </Link>
        <Link href="/categories/santeDigitale">
          <div className="categorie-card">
            <Image
              src={santeDigitale}
              alt="Image"
              className="categorie-card-image"
            />
          </div>
        </Link>
        <Link href="/categories/lifestyle">
          <div className="categorie-card">
            <Image
              src={lifestyle}
              alt="Image"
              className="categorie-card-image"
            />
          </div>
        </Link>
      </div>
    </div>
  );
}

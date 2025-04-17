import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function pages() {
  return (
    <div className="rgpd">
      <Navbar />
      <div className="rgpd-content">
        <h1>📜 Mentions légales – Haven°</h1>

        <section>
          <h2>🧑‍💻 Éditeur du site</h2>
          <p>
            <strong>Nom du site :</strong> Haven°
          </p>
          <p>
            <strong>Responsable de la publication :</strong> Alexis Priour
          </p>
          <p>
            <strong>Contact :</strong> alexis.priour@gmail.com
          </p>
          <p>
            <strong>Statut :</strong> Particulier
          </p>
          <p>
            <strong>Adresse :</strong> Adresse disponible sur demande
          </p>
        </section>

        <section>
          <h2>🖥 Hébergeur</h2>
          <p>
            <strong>Service d’hébergement de la base de données :</strong>{" "}
            Neon.tech (
            <a
              href="https://neon.tech"
              target="_blank"
              rel="noopener noreferrer"
            >
              neon.tech
            </a>
            )
          </p>
          <p>
            <strong>Hébergement web :</strong> Local (développement uniquement)
          </p>
        </section>

        <section>
          <h2>🛡 Propriété intellectuelle</h2>
          <p>
            Tous les éléments présents sur le site (contenus, textes, visuels,
            logo Haven°) sont la propriété de leurs auteurs respectifs et ne
            peuvent être reproduits sans autorisation préalable.
          </p>
        </section>

        <section>
          <h2>⚖ Responsabilité</h2>
          <p>
            Haven° est un espace d’échange communautaire. Le contenu publié par
            les utilisateurs est de leur responsabilité. En cas de signalement
            ou de contenu inapproprié, vous pouvez contacter l’administrateur à
            : <strong>alexis.priour@gmail.com</strong>
          </p>
        </section>

        <section>
          <h2>🧾 Données personnelles</h2>
          <p>
            La gestion des données personnelles est décrite dans notre{" "}
            <a href="/politique-de-confidentialite">
              politique de confidentialité
            </a>
            . Conformément au RGPD, vous disposez d’un droit d’accès, de
            modification et de suppression de vos données.
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
}

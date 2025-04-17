import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function page() {
  return (
    <div className="rgpd">
      <Navbar />
      <div className="rgpd-content">
        <h2>🔐 Politique de confidentialité – Haven°</h2>
        <p>Dernière mise à jour : avril 2025</p>
        <p>
          Chez Haven°, nous respectons votre vie privée. Cette politique de
          confidentialité explique comment nous collectons, utilisons et
          protégeons vos données personnelles.
        </p>
        <h3>📌 1. Qui sommes-nous ?</h3>
        <ul>
          <li>Nom du site : Haven°</li>
          <li>URL : http://localhost:3000/</li>
          <li>Contact responsable : alexis.priour@gmail.com</li>
        </ul>
        <h3>📥 2. Données que nous collectons</h3>
        <p>
          Lors de votre inscription ou de votre utilisation du forum, nous
          collectons les informations suivantes :
        </p>
        <ul>
          <li>Nom et prénom</li>
          <li>Adresse e-mail</li>
          <li>Ville (facultatif)</li>
          <li>Âge (facultatif)</li>
          <li>Contenu publié sur le forum</li>
        </ul>
        <p>
          Ces données sont fournies volontairement par vous via les formulaires
          du site (inscription, contact).
        </p>

        <h3>🎯 3. Utilisation de vos données</h3>
        <p>Les données sont utilisées uniquement pour :</p>
        <ul>
          <li>Gérer votre compte et vous authentifier</li>
          <li>
            Permettre l’utilisation normale du forum (participation,
            publication, interactions)
          </li>
          <p>
            Vos données ne sont pas utilisées à des fins publicitaires, ni
            revendues à des tiers.
          </p>
        </ul>
        <h3>💾 4. Stockage et sécurité</h3>
        <p>
          Les données sont stockées sur une base de données PostgreSQL
          sécurisée, hébergée via la plateforme cloud Neon.tech.
        </p>
        <p>
          Nous utilisons des protocoles de sécurité adaptés pour protéger vos
          informations (connexion HTTPS, restrictions d’accès, sécurité des
          serveurs).
        </p>
        <h3>🔐 5. Authentification et sessions</h3>
        <p>Haven° utilise un système d’authentification via token JWT.</p>
        <p>
          Le token est stocké dans le localStorage de votre navigateur afin de
          maintenir votre session utilisateur.
        </p>
        <p>
          Nous n’utilisons pas de cookies ni de traceurs tiers pour le moment.
        </p>
        <h3>⚙️ 6. Vos droits</h3>
        <p>
          Conformément à la législation applicable (notamment le RGPD), vous
          disposez des droits suivants :
        </p>
        <ul>
          <li>Accès à vos données personnelles</li>
          <li>Modification ou mise à jour de vos informations</li>
          <li>Suppression de votre compte et de vos données</li>
        </ul>
        <p>Pour exercer vos droits, écrivez à : alexis.priour@gmail.com</p>
        <h3>🚫 7. Partage des données</h3>
        <p>
          Nous ne transmettons aucune donnée personnelle à des tiers. Vos
          données ne sont ni revendues, ni partagées.
        </p>
        <h3>✏️ 8. Modifications</h3>
        <p>
          Cette politique peut être amenée à évoluer. Toute modification
          importante sera communiquée via le forum.
        </p>
      </div>
      <Footer />
    </div>
  );
}

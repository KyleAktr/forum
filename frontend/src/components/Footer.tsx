export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <a href="/">Haven°</a>
          <p>
            Chaque idée compte. Chaque voix construit demain. <br />
            Continuez à cultiver l’essentiel, ici et ailleurs.
          </p>
          <p>
            &copy; 2025 Haven° <br />
            Tous droits réservés.
          </p>
        </div>
        <div className="footer-links">
          <div className="fonctionnalites">
            <h3>Fonctionnalités</h3>
            <a href="/creation-article">Créer un article</a>
            <a href="/categories">Catégories</a>
            <a href="/profil">Voir mon profil</a>
            <a href="/network">Réseau</a>
          </div>
          <div className="infos">
            <h3>Informations</h3>
            <a href="/RGPD">Politique de confidentialté</a>
            <a href="/mentions">Mentions légales</a>
            <a href="/contact">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

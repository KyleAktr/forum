import type { Metadata } from "next";

// Métadonnées par défaut pour l'application
export const defaultMetadata: Metadata = {
  title: {
    default: "Forum Haven",
    template: "%s | Forum Haven"
  },
  description: "Un forum de discussion sur les modes de vie et l'environnement",
  keywords: ["forum", "minimalisme", "télétravail", "santé digitale", "lifestyle durable"],
  authors: [{ name: "Haven" }],
  creator: "Haven",
  publisher: "Haven",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

// Métadonnées spécifiques pour la page d'accueil
export const homeMetadata: Metadata = {
  title: "Accueil",
  description: "Bienvenue sur Haven, un souffle nouveau sur nos manières de vivre.",
};

// Métadonnées pour les pages de catégories
export const categoryMetadata = (categoryName: string): Metadata => ({
  title: `Catégorie - ${categoryName}`,
  description: `Explorez les discussions sur ${categoryName}`,
});

// Métadonnées pour les pages de profil
export const profileMetadata: Metadata = {
  title: "Profil utilisateur",
  description: "Informations et contributions d'un utilisateur",
};

// Métadonnées pour les pages d'articles
export const articleMetadata = (title: string): Metadata => ({
  title: title,
  description: `Lisez l'article: ${title}`,
}); 
# Forum Web Application

Une application de forum moderne développée avec Next.js et Go, permettant aux utilisateurs de créer, partager et discuter sur différents sujets.

### Configuration du Backend

1. Naviguez vers le répertoire backend:

   ```
   cd backend
   ```

2. Créez un fichier `.env` basé sur l'exemple:

   ```
   # Base de données PostgreSQL
   DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
   ```

Clé secrète pour le JWT

JWTSECRET="your_jwt_secret_here"

Identifiants OAuth Google

GOOGLE_CLIENT_ID="your_google_client_id_here"
GOOGLE_CLIENT_SECRET="your_google_client_secret_here"
GOOGLE_CALLBACK_URL="http://localhost:3000/api/auth/callback/google"

URL du frontend

FRONTEND_URL="http://localhost:3000"

Configurations EmailJS

NEXT_PUBLIC_EMAILJS_SERVICE_ID="your_emailjs_service_id"
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID="your_emailjs_template_id"
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY="your_emailjs_public_key"

```

3. Lancez le serveur:

```

go run main.go

```

### Configuration du Frontend

1. Naviguez vers le répertoire frontend:

```

cd frontend

```

2. Installez les dépendances et lancez le serveur de développement:
```

npm install
npm run dev

```

## 🗂️ Structure du Projet

### Backend

- `controllers/` - Logique de traitement des requêtes
- `models/` - Définition des modèles de données
- `middleware/` - Middleware pour l'authentification et autres fonctionnalités
- `database/` - Configuration de la base de données
- `utils/` - Fonctions utilitaires
- `uploads/` - Stockage des fichiers téléchargés

### Frontend

- `src/app/` - Routes et pages de l'application Next.js
- `src/components/` - Composants React réutilisables
- `src/lib/` - Fonctions utilitaires et hooks personnalisés
- `src/styles/` - Fichiers SCSS et configurations Tailwind

## 📋 Fonctionnalités

- Authentification des utilisateurs (inscription, connexion, profil)
- Création et édition d'articles
- Commentaires et discussions
- Recherche de contenu
- Catégorisation des discussions
- Téléchargement d'images

## 📝 Notes de Développement

- L'affichage des articles sur la page utilisateur est géré par:

- Back: `GetUserPosts` dans `post_controller.go`
- Front: `getMyPosts` dans `post.ts`, utilisé dans `profil/page.tsx`

- L'affichage des articles sur la page Explorer est géré par:
- Back: `GetPosts` dans `post_controller.go`
- Front: `getPosts` dans `post.ts`, utilisé dans `explorer/page.tsx`
```

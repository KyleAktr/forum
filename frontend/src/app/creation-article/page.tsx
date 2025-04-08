"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";
// import { Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { createPost } from "@/services/post";

export default function Page() {
  const router = useRouter();

  const [image, setImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const newPost = await createPost({
        title: formData.title,
        content: formData.content,
        category_id: formData.category,
      });
      router.push(`/`);
    } catch (err) {
      console.error("Erreur lors de la création du post", err);
    }
  };

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

  return (
    <div>
      <Navbar />
      <header>
        <h1>Créer un article</h1>
      </header>

      <div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Titre :</label>
          <input
            type="text"
            name="title"
            id="title"
            placeholder="Titre de l'article"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
          <br />

          <label htmlFor="category_id">Catégorie :</label>
          <select
            id="category_id"
            name="category_id"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: Number(e.target.value) })
            }
            required
          >
            <option value="1">Travail hybride et télétravail</option>
            <option value="2">Minimalisme et frugalité</option>
            <option value="3">Santé mentale et digitale</option>
            <option value="4">Lifestyle durable</option>
          </select>

          {/* <div>
            <label htmlFor="banner-image" className="cursor-pointer">
              <Upload className="inline-block mr-2" />
              Choisir une image pour la bannière de l'article
            </label>
            <br />
            <input
              id="banner-image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />

            {image && (
              <div className="relative">
                <img
                  src={image}
                  alt="Aperçu"
                  className="mt-2 w-full max-w-md"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-0 right-0 p-1"
                >
                  <X className="w-4 h-4 text-red-500" />
                </button>
              </div>
            )}
          </div> */}

          <label htmlFor="content">Contenu de l'article</label>
          <br />
          <textarea
            name="content"
            id="content"
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            required
            rows={10}
            cols={50}
          ></textarea>
          <br />

          <button type="submit">Publier l'article</button>
        </form>
      </div>
    </div>
  );
}

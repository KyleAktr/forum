import Navigation from "@/components/Navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forum - Accueil",
  description: "Page d'accueil",
};

export default function Home() {
  return (
    <div>
      <h1>Forum</h1>
      <Navigation />
    </div>
  );
}

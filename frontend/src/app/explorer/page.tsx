import Navbar from "@/components/Navbar";

export default function page() {
  return (
    <div>
      <Navbar />
      <div className="explorer">
        <h1>Explorer</h1>
        <p>Bienvenue sur la page d'exploration !</p>
        <p>Vous pouvez explorer les articles et les catégories ici.</p>
        <p>Utilisez le menu pour naviguer vers d'autres sections.</p>
      </div>
    </div>
  );
}

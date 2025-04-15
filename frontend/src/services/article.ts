export async function getArticleById(id: string) {
  const res = await fetch(`http://localhost:8080/api/posts/${id}`);

  if (!res.ok) {
    throw new Error("Impossible de récupérer l'article");
  }

  const json = await res.json();
  return json.data;
}

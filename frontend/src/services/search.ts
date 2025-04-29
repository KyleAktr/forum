export const getSearchSuggestions = async (query: string): Promise<string[]> => {
  try {
    const res = await fetch(`http://localhost:8080/api/search/suggestions?q=${encodeURIComponent(query)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.suggestions || [];
  } catch {
    return [];
  }
}; 
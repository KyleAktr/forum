import { useState } from "react";
import { getSearchSuggestions } from "@/services/search";

export default function SearchBar({
  onSearch,
}: {
  onSearch: (query: string) => void;
}) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(input);
    setInput("");
    setShowSuggestions(false);
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    if (value.length > 1) {
      const results = await getSearchSuggestions(value);
      setSuggestions(results);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setShowSuggestions(false);
    onSearch(suggestion);
  };

  return (
    <div style={{ position: "relative" }}>
      <form className="search-bar" onSubmit={handleSubmit} autoComplete="off">
        <input
          type="text"
          value={input}
          onChange={handleChange}
          placeholder="Rechercher un article"
        />
        <button type="submit">Rechercher</button>
      </form>
      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-list"
        >
          {suggestions.map((s, i) => (
            <li
              key={i}
              style={{ padding: "8px", cursor: "pointer" }}
              onClick={() => handleSuggestionClick(s)}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

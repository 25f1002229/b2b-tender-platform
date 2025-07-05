"use client";
import { useState } from "react";

// Define your result type (should match the one in page.tsx)
interface ResultType {
  id: number;
  name: string;
}

interface SearchTabProps {
  onResults: (results: ResultType[]) => void;
}

export default function SearchTab({ onResults }: SearchTabProps) {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `http://localhost:5000/api/search/companies?q=${encodeURIComponent(q)}`
      );
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      onResults(data);
    } catch (err: any) {
      setError(err.message || "Search failed");
      onResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="flex flex-col gap-2 mb-4">
      <div className="flex gap-2">
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search companies..."
          className="border px-3 py-2 rounded w-64"
          disabled={loading}
        />
        <button
          onClick={handleSearch}
          className={`px-4 py-2 rounded text-white transition ${
            loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
          type="button"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
    </div>
  );
}
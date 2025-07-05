"use client";
import { useState } from "react";

interface SearchBarProps {
  onResults: (results: any[]) => void;
}

export default function SearchBar({ onResults }: SearchBarProps) {
  const [q, setQ] = useState("");

  const handleSearch = async () => {
    if (!q.trim()) return;
    const res = await fetch(`http://localhost:5000/api/search/companies?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    onResults(data);
  };

  return (
    <div className="flex gap-2 mb-4">
      <input
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="Search companies..."
        className="border px-3 py-2 rounded w-64"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        type="button"
      >
        Search
      </button>
    </div>
  );
}
"use client";
import { useState } from "react";
import SearchBar from "@/app/dashboard/Companies/SearchBar";

export default function CompaniesPage() {
  const [results, setResults] = useState<any[]>([]);

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Companies</h1>
      <SearchBar onResults={setResults} />
      <ul className="space-y-3">
        {results.length === 0 ? (
          <li className="text-gray-500">No results yet. Try searching!</li>
        ) : (
          results.map(company => (
            <li key={company.id} className="border rounded p-3">
              <div className="font-semibold">{company.name}</div>
              <div className="text-sm text-gray-600">{company.industry}</div>
              <div className="text-xs text-gray-500">{company.description}</div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

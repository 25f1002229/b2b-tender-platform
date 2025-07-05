"use client";
import { useState } from "react";
import dynamic from "next/dynamic";

// Define your result type
interface ResultType {
  id: number;
  name: string;
}

const SearchTabDynamic = dynamic(() => import("./SearchTab"), { ssr: false });

export default function SearchTabWrapper() {
  const [, setResults] = useState<ResultType[]>([]);

  return (
    <div>
      <SearchTabDynamic onResults={setResults} />
      {/* The Results section and "No results" message have been removed */}
    </div>
  );
}
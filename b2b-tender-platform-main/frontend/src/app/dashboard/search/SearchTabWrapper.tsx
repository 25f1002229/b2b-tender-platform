/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";
import { useState } from "react";
import dynamic from "next/dynamic";

interface ResultType {
  id: number;
  name: string;
}

const SearchTabDynamic = dynamic(() => import("./SearchTab"), { ssr: false });

export default function SearchTabWrapper() {
  const [, setResults] = useState<ResultType[]>([]);
  return <SearchTabDynamic onResults={setResults} />;
}
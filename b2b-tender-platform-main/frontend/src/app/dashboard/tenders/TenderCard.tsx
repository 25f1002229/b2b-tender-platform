"use client";
import { useEffect, useState } from "react";

interface TenderCardProps {
  id: number;
  title: string;
  description: string;
  budget?: number;
  deadline?: string;
  onClick?: () => void;
}

export function TenderCard({
  id,
  title,
  description,
  budget,
  deadline,
  onClick,
}: TenderCardProps) {
  const [formattedDeadline, setFormattedDeadline] = useState<string | null>(null);

  useEffect(() => {
    if (deadline) {
      setFormattedDeadline(
        new Date(deadline).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      );
    } else {
      setFormattedDeadline(null);
    }
  }, [deadline]);

  // Keyboard accessibility: Enter/Space triggers click
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === " ") && onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <article
      aria-labelledby={`tender-title-${id}`}
      className={`bg-white rounded-lg shadow p-6 transition-shadow 
        hover:shadow-lg hover:bg-blue-50 cursor-pointer focus-within:ring-2 focus-within:ring-blue-500`}
      tabIndex={0}
      role="button"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      style={{ outline: "none" }}
    >
      <h3
        id={`tender-title-${id}`}
        className="text-lg font-bold text-blue-600 hover:text-blue-800 truncate"
        title={title}
      >
        {title}
      </h3>
      <p className="mt-2 text-gray-600 line-clamp-3" title={description}>
        {description}
      </p>
      <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
        {budget !== undefined && budget !== null ? (
          <span className="font-medium">Budget: ${budget.toLocaleString()}</span>
        ) : (
          <span className="italic">Budget: N/A</span>
        )}
        {deadline ? (
          <time dateTime={deadline} aria-label={`Deadline: ${formattedDeadline || "unknown"}`}>
            Deadline: {formattedDeadline || "—"}
          </time>
        ) : (
          <span className="italic">Deadline: N/A</span>
        )}
      </div>
    </article>
  );
}
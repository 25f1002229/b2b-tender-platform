"use client";
import { useState } from "react";

interface TenderFormProps {
  onSubmit: (tender: {
    title: string;
    description: string;
    budget?: number;
    deadline?: string;
  }) => Promise<void> | void;
}

export default function TenderForm({ onSubmit }: TenderFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await onSubmit({
        title,
        description,
        budget: budget ? Number(budget) : undefined,
        deadline,
      });
      setTitle('');
      setDescription('');
      setBudget('');
      setDeadline('');
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to create tender");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input
        className="border rounded px-3 py-2 w-full"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
        disabled={loading}
      />
      <textarea
        className="border rounded px-3 py-2 w-full"
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        required
        rows={4}
        disabled={loading}
      />
      <input
        className="border rounded px-3 py-2 w-full"
        placeholder="Budget"
        type="number"
        value={budget}
        onChange={e => setBudget(e.target.value)}
        disabled={loading}
      />
      <input
        className="border rounded px-3 py-2 w-full"
        placeholder="Deadline"
        type="date"
        value={deadline}
        onChange={e => setDeadline(e.target.value)}
        disabled={loading}
      />
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">Tender created successfully!</div>}
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Tender"}
      </button>
    </form>
  );
}
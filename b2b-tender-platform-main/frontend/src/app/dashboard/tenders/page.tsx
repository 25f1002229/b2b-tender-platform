"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "contexts/AuthContext";
import { TenderCard } from "./TenderCard";
import TenderForm from "./TenderForm";

interface Tender {
  id: number;
  title: string;
  description: string;
  budget?: number;
  deadline?: string;
  status?: string;
  companyId?: number;
}

export default function TendersTab() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);

  const { logout } = useAuth();
  const router = useRouter();

  // Fetch tenders on mount or after creation
  const fetchTenders = () => {
    setLoading(true);
    setError(null);
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tenders`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch tenders");
        return res.json();
      })
      .then(data => setTenders(Array.isArray(data.tenders) ? data.tenders : []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTenders();
  }, []);

  // Create new tender
  const handleCreateTender = async (newTender: Omit<Tender, "id">) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tenders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTender),
      });
      if (!res.ok) throw new Error("Failed to create tender");
      setShowForm(false);
      fetchTenders(); // Refresh list
    } catch (err: any) {
      alert(err.message || "Failed to create tender");
    }
  };

  // Handle logout and redirect to login
  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Active Tenders</h2>
        <div className="flex gap-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold"
            onClick={() => setShowForm(v => !v)}
          >
            {showForm ? "Cancel" : "Create New Tender"}
          </button>
          <button
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 font-semibold"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mb-8">
          <TenderForm onSubmit={handleCreateTender} />
        </div>
      )}

      {loading ? (
        <div className="text-gray-500">Loading tenders...</div>
      ) : error ? (
        <div className="text-red-500">Error: {error}</div>
      ) : tenders.length === 0 ? (
        <div className="text-gray-500">No tenders available.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {tenders.map(tender => (
            <TenderCard key={tender.id} {...tender} />
          ))}
        </div>
      )}
    </section>
  );
}

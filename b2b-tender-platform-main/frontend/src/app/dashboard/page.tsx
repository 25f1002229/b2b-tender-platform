"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardData {
  totalTenders: number;
  activeTenders: number;
  totalCompanies: number;
  recentTenders: any[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard`)
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Dashboard</h1>
      {user && (
        <div className="mb-8">
          <span className="text-lg font-semibold">Welcome, </span>
          <span className="text-lg text-blue-800 font-bold">{user.email}</span>
        </div>
      )}
      {loading ? (
        <div className="text-gray-600">Loading dashboard...</div>
      ) : data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-100 rounded-lg shadow p-6 text-center">
              <div className="text-2xl font-bold text-blue-700">{data.totalTenders}</div>
              <div className="text-gray-700 mt-2">Total Tenders</div>
            </div>
            <div className="bg-green-100 rounded-lg shadow p-6 text-center">
              <div className="text-2xl font-bold text-green-700">{data.activeTenders}</div>
              <div className="text-gray-700 mt-2">Active Tenders</div>
            </div>
            <div className="bg-yellow-100 rounded-lg shadow p-6 text-center">
              <div className="text-2xl font-bold text-yellow-700">{data.totalCompanies}</div>
              <div className="text-gray-700 mt-2">Total Companies</div>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4 text-blue-800">Recent Tenders</h2>
            <ul className="space-y-3">
              {data.recentTenders?.map((tender: any) => (
                <li key={tender.id} className="bg-white shadow rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="font-semibold text-blue-700">{tender.title}</div>
                    <div className="text-gray-600">{tender.description}</div>
                  </div>
                  <Link href={`/tenders/${tender.id}`}>
                    <button className="mt-3 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition">
                      View
                    </button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

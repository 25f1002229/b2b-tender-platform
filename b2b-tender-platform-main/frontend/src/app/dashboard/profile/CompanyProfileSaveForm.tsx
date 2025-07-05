"use client";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

interface Company {
  id: number;
  name: string;
  industry: string;
  description: string;
  email: string;
  logo?: string | null;
}

export default function CompanyProfileForm() {
  // Use Next.js App Router's useParams
  const params = useParams();
  // In App Router, params is a Record<string, string | string[]>
  const idParam = params?.id;
  const companyId = typeof idParam === "string" ? Number(idParam) : Array.isArray(idParam) ? Number(idParam[0]) : NaN;

  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!companyId || isNaN(companyId)) return;
    setLoading(true);
    setError(null);
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/companies/${companyId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load company data.");
        return res.json();
      })
      .then((data) => {
        setCompany(data);
        setLogoUrl(data.logo || "");
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load company data.");
        setLoading(false);
      });
  }, [companyId]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !company) return;
    setUploading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You must be logged in to upload a logo.");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/upload/logo`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || errData.message || "Upload failed");
      }
      const data = await res.json();
      setLogoUrl(data.url);

      const updateRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/companies/${company.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ logo: data.url }),
      });
      if (!updateRes.ok) {
        const updateErr = await updateRes.json();
        throw new Error(updateErr.error || updateErr.message || "Profile update failed");
      }
      setCompany((prev) => prev ? { ...prev, logo: data.url } : prev);
      setSuccess("Logo updated!");
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!company) return;
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to update the profile.");
      return;
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/companies/${company.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: company.name || "",
        industry: company.industry || "",
        description: company.description || "",
        logo: logoUrl || "",
      }),
    });
    if (!res.ok) {
      const errData = await res.json();
      setError(errData.error || errData.message || "Failed to update profile.");
      return;
    }
    const updated = await res.json();
    setCompany(updated);
    setSuccess("Profile updated!");
  };

  if (loading) return <div className="text-gray-500">Loading...</div>;
  if (!company) return <div className="text-red-500">No company data available</div>;

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-8">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Company Profile</h2>
      <form onSubmit={handleUpdate} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="name">Company Name</label>
          <input
            id="name"
            type="text"
            required
            value={company.name || ""}
            onChange={e => setCompany({ ...company, name: e.target.value })}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="industry">Industry</label>
          <input
            id="industry"
            type="text"
            required
            value={company.industry || ""}
            onChange={e => setCompany({ ...company, industry: e.target.value })}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="description">Description</label>
          <textarea
            id="description"
            required
            value={company.description || ""}
            onChange={e => setCompany({ ...company, description: e.target.value })}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={3}
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Logo</label>
          <div className="flex items-center gap-4">
            {logoUrl && (
              <img
                src={logoUrl}
                alt="Logo"
                className="h-16 w-16 rounded bg-gray-100 object-contain border"
              />
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleLogoUpload}
              disabled={uploading || loading}
              className="block"
            />
            {uploading && <span className="text-xs text-gray-500">Uploading...</span>}
          </div>
        </div>
        {error && (
          <div className="bg-red-100 text-red-700 rounded px-3 py-2 text-sm">{error}</div>
        )}
        {success && (
          <div className="bg-green-100 text-green-700 rounded px-3 py-2 text-sm">{success}</div>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
          disabled={loading}
        >
          Save Profile
        </button>
      </form>
    </div>
  );
}

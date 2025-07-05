"use client";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";

interface Company {
  id: number;
  name: string;
  industry: string;
  description: string;
  email: string;
  logo?: string | null;
}

export default function CompanyProfileForm() {
  const { user } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-hide success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Fetch company profile on mount
  useEffect(() => {
    if (!user?.company?.id) return;
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/companies/${user.company.id}`, {
      headers: { "Authorization": `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load company data.");
        return res.json();
      })
      .then((data) => {
        setCompany(data);
        setLogoUrl(data.logo || "");
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load company data.");
        setLoading(false);
      });
  }, [user]);

  // Handle logo upload (only in edit mode)
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !user?.company?.id || !editMode) return;
    const file = e.target.files[0];
    const filePath = `logos/${user.company.id}-${Date.now()}-${file.name}`;
    setUploading(true);
    setError(null);
    setSuccess(null);

    const { error: uploadError } = await supabase.storage
      .from("company-assets")
      .upload(filePath, file);

    if (uploadError) {
      setError("Logo upload failed: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { publicUrl } = supabase.storage
      .from("company-assets")
      .getPublicUrl(filePath).data;

    if (!publicUrl) {
      setError("Failed to get public URL for uploaded logo.");
      setUploading(false);
      return;
    }

    setLogoUrl(publicUrl);

    const token = localStorage.getItem("token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/companies/${user.company.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ logo: publicUrl }),
    });

    if (!res.ok) {
      setError("Failed to update logo in profile.");
      setUploading(false);
      return;
    }

    const updated = await res.json();
    setCompany(updated);
    setSuccess("Logo updated!");
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Save profile and switch to view mode
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!company) return;
    const token = localStorage.getItem("token");
    setLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/companies/${company.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: company.name || "",
        industry: company.industry || "",
        description: company.description || "",
        email: company.email || "",
        logo: logoUrl || "",
      }),
    });
    setLoading(false);
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      setError(errData.error || errData.message || "Failed to update profile.");
      return;
    }
    const updated = await res.json();
    setCompany(updated);
    setSuccess("Profile updated and saved!");
    setEditMode(false);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <span className="text-blue-500 text-lg font-semibold animate-pulse">Loading...</span>
    </div>
  );
  if (!company) return <div className="text-red-500">No company data available</div>;

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-8 border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Company Profile</h2>
      {success && (
        <div className="mb-4 flex items-center justify-center gap-2 bg-green-100 border border-green-300 text-green-700 rounded px-4 py-2 shadow transition-all">
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="mb-4 flex items-center justify-center gap-2 bg-red-100 border border-red-300 text-red-700 rounded px-4 py-2 shadow transition-all">
          <span>{error}</span>
        </div>
      )}
      {editMode ? (
        <form onSubmit={handleUpdate} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">Company Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="organization"
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
              name="industry"
              type="text"
              required
              autoComplete="organization"
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
              name="description"
              required
              autoComplete="off"
              value={company.description || ""}
              onChange={e => setCompany({ ...company, description: e.target.value })}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={3}
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={company.email || ""}
              onChange={e => setCompany({ ...company, email: e.target.value })}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                autoComplete="off"
              />
              {uploading && <span className="text-xs text-gray-500">Uploading...</span>}
            </div>
          </div>
          <div className="pt-6">
            <button
              type="button"
              className="w-full text-xl bg-gray-400 hover:bg-gray-500 text-white font-bold py-4 px-8 rounded-lg transition-all shadow-lg tracking-wide mb-3"
              onClick={() => setEditMode(false)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full text-xl bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg transition-all shadow-lg tracking-wide"
              disabled={loading}
            >
              Save Profile
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div>
            <span className="font-medium">Company Name: </span>{company.name}
          </div>
          <div>
            <span className="font-medium">Industry: </span>{company.industry}
          </div>
          <div>
            <span className="font-medium">Description: </span>{company.description}
          </div>
          <div>
            <span className="font-medium">Email: </span>{company.email}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Logo:</label>
            {company.logo && (
              <img
                src={company.logo}
                alt="Logo"
                className="h-16 w-16 rounded bg-gray-100 object-contain border inline-block"
              />
            )}
          </div>
          <div className="pt-6">
            <button
              type="button"
              className="w-full text-xl bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg transition-all shadow-lg tracking-wide"
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

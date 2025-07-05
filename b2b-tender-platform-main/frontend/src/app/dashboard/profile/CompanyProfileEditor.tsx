"use client";
import { useEffect, useRef, useState } from "react";

interface Company {
  id: number;
  name: string;
  industry: string;
  description: string;
  email: string;
  logo?: string | null;
}

export default function CompanyProfileEditor({ companyId }: { companyId: number }) {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch company data
  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/companies/${companyId}`)
      .then((res) => res.json())
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

  // Handle logo upload
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

      // Upload logo to backend
      const res = await fetch("http://localhost:5000/api/upload/logo", {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || errData.message || "Upload failed");
      }
      const data = await res.json();
      setLogoUrl(data.url);

      // Update profile with new logo
      const updateRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/profile/company/${company.id}`, {
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

  // Handle profile update
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
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/profile/company/${company.id}`, {
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

  if (loading) return <div>Loading...</div>;
  if (!company) return <div>No company data available</div>;

  return (
    <form onSubmit={handleUpdate}>
      <input
        type="text"
        value={company.name || ""}
        onChange={e => setCompany({ ...company, name: e.target.value })}
        placeholder="Company Name"
        required
      />
      <input
        type="text"
        value={company.industry || ""}
        onChange={e => setCompany({ ...company, industry: e.target.value })}
        placeholder="Industry"
        required
      />
      <textarea
        value={company.description || ""}
        onChange={e => setCompany({ ...company, description: e.target.value })}
        placeholder="Description"
        required
      />
      <div>
        {logoUrl && <img src={logoUrl} alt="Logo" width={100} />}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleLogoUpload}
          disabled={uploading}
        />
        {uploading && <span>Uploading...</span>}
      </div>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {success && <div style={{ color: "green" }}>{success}</div>}
      <button type="submit">Save Profile</button>
    </form>
  );
}

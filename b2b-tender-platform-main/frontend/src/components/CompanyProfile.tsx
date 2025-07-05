/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { useState } from 'react';
import Image from 'next/image';
import type { Company } from '@/types/types';

interface CompanyProfileProps {
  company?: Company;
}

export default function CompanyProfile({ company }: CompanyProfileProps) {
  const [logoUrl] = useState(company?.logo_url || '');

  // No parameter needed since upload logic is not implemented yet
  const handleLogoUpload = async () => {
    // Implement logo upload logic here when ready
    // Example:
    // if (e.target.files?.[0]) {
    //   const file = e.target.files[0];
    //   // upload logic...
    //   setLogoUrl(newUrl);
    // }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Company Profile</h2>
      <div className="flex items-center mb-6">
        {logoUrl ? (
          <div className="relative w-16 h-16">
            <Image
              src={logoUrl}
              alt="Company Logo"
              fill
              className="rounded-full object-cover"
            />
          </div>
        ) : (
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
        )}
        <label className="ml-4 cursor-pointer">
          <span className="text-blue-600 font-medium">Upload logo</span>
          <input 
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={handleLogoUpload}
          />
        </label>
      </div>

      {company ? (
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Name</h3>
            <p>{company.name}</p>
          </div>
          {company.industry && (
            <div>
              <h3 className="font-semibold">Industry</h3>
              <p>{company.industry}</p>
            </div>
          )}
          {company.description && (
            <div>
              <h3 className="font-semibold">Description</h3>
              <p>{company.description}</p>
            </div>
          )}
        </div>
      ) : (
        <p>No company data available</p>
      )}
    </div>
  );
}
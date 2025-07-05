// src/app/layout.tsx
import React from "react";
import "../styles/globals.css";
import MainNavTabs from "../components/MainNavTabs";
import { AuthProvider } from "../contexts/AuthContext"; // Add this import

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen font-sans text-gray-900">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">
            <span className="font-extrabold text-2xl text-blue-700 tracking-tight">
            </span>
            <span className="hidden md:inline-block text-xs text-blue-800 bg-blue-100 rounded px-2 py-1 ml-2">
              MVP
            </span>
          </div>
        </header>
        <MainNavTabs />
        {/* Wrap your main content with AuthProvider */}
        <AuthProvider>
          <main className="max-w-7xl mx-auto px-8 py-12">{children}</main>
        </AuthProvider>
        <footer className="border-t bg-white py-6 text-center text-sm text-gray-500 mt-16">
          &copy; {new Date().getFullYear()} B2B Tender Platform. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
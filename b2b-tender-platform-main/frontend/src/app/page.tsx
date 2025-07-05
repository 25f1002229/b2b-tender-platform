"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to register page, passing email as query param (optional)
    router.push(`/register?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f7f9]">
      <main className="flex-1 flex flex-col md:flex-row items-center justify-center px-4 py-10 md:py-0 gap-10 md:gap-0">
        {/* Left: Headline and Form */}
        <section className="w-full md:w-1/2 flex flex-col justify-center items-start max-w-xl">
          <span className="uppercase text-xs tracking-widest text-gray-500 mb-2 font-semibold">B2B Tender Platform</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            The only tool you need<br />to <span className="text-yellow-400">find & win</span> more business
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            Discover, bid, and manage B2B tenders all in one place. Trusted by top companies to streamline procurement and grow revenue.
          </p>
          {/* Signup form */}
          <form
            className="w-full flex flex-col sm:flex-row gap-3 mb-4"
            onSubmit={handleSubmit}
          >
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="flex-1 px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white shadow-sm"
            />
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-6 py-3 rounded shadow transition"
            >
              Sign up for free
            </button>
          </form>
          <p className="text-xs text-gray-400 mt-4">
            By signing up, you agree to our <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.
          </p>
        </section>
        {/* Right: Product Screenshot */}
        <section className="hidden md:flex w-1/2 justify-end items-center">
          <div className="relative w-[520px] h-[340px] rounded-xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
            <Image
              src="/dashboard-screenshot.png"
              alt="B2B Tender Platform Screenshot"
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
        </section>
      </main>
    </div>
  );
}
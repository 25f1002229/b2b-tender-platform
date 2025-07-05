"use client";
import { useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamically import your tab pages
const TendersTab = dynamic(() => import("./tenders/page"), { ssr: false });
const SearchTab = dynamic(() => import("./search/page"), { ssr: false });
const ProfileTab = dynamic(() => import("./profile/page"), { ssr: false });

const tabs = [
  { label: "Tenders", href: "/dashboard/tenders", component: TendersTab },
  { label: "Search", href: "/dashboard/search", component: SearchTab },
  { label: "Profile", href: "/dashboard/profile", component: ProfileTab },
];

export default function DashboardTabs() {
  const router = useRouter();
  const pathname = usePathname();

  // Find the active tab based on the current URL
  const activeTab = useMemo(() => {
    return tabs.find(tab => pathname === tab.href) || tabs[0];
  }, [pathname]);

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-8">
        <h1 className="text-3xl font-bold mb-6 text-blue-700">B2B Tender Dashboard</h1>
        <div className="flex border-b mb-6">
          {tabs.map(tab => (
            <button
              key={tab.label}
              onClick={() => router.push(tab.href, { scroll: false })}
              className={`px-6 py-2 -mb-px border-b-2 transition-colors outline-none
                ${
                  pathname === tab.href
                    ? "border-blue-600 text-blue-600 font-bold"
                    : "border-transparent text-gray-500 hover:text-blue-600"
                }
              `}
              type="button"
              aria-current={pathname === tab.href ? "page" : undefined}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div>
          <activeTab.component />
        </div>
      </div>
    </main>
  );
}
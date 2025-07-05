"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Login", href: "/login" },
  { label: "Register", href: "/register" },
];

export default function MainNavTabs() {
  const pathname = usePathname();

  return (
    <nav className="flex justify-center my-8" aria-label="Primary navigation">
      <div className="flex bg-gray-100 rounded-lg shadow-inner overflow-hidden">
        {navLinks.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={`
                px-6 py-2 text-base font-semibold transition-colors duration-200
                border-r border-gray-300 last:border-r-0
                focus:outline-none
                ${isActive
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"}
              `}
              style={{ minWidth: 140, textAlign: "center" }}
              prefetch={true}
              tabIndex={0}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
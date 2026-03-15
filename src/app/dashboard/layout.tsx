"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    label: "Vue d'ensemble",
    href: "/dashboard",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="6" height="6" rx="1" />
        <rect x="11" y="3" width="6" height="6" rx="1" />
        <rect x="3" y="11" width="6" height="6" rx="1" />
        <rect x="11" y="11" width="6" height="6" rx="1" />
      </svg>
    ),
  },
  {
    label: "Suggestions",
    href: "/dashboard/suggestions",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 3v2M10 15v2M3 10h2M15 10h2" />
        <circle cx="10" cy="10" r="4" />
      </svg>
    ),
    badge: 5,
  },
  {
    label: "Sources",
    href: "/dashboard/sources",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="10" cy="6" rx="7" ry="3" />
        <path d="M3 6v4c0 1.66 3.13 3 7 3s7-1.34 7-3V6" />
        <path d="M3 10v4c0 1.66 3.13 3 7 3s7-1.34 7-3v-4" />
      </svg>
    ),
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-light flex">
      {/* Sidebar */}
      <aside className="w-64 bg-dark text-light flex flex-col shrink-0">
        <div className="px-6 h-16 flex items-center border-b border-white/10">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            doc<span className="text-orchid">pilot</span>
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-white/10 text-light"
                    : "text-light/50 hover:text-light hover:bg-white/5"
                }`}
              >
                {item.icon}
                {item.label}
                {item.badge && (
                  <span className="ml-auto bg-orchid/30 text-orchid text-xs font-medium px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3">
            <div className="w-8 h-8 rounded-full bg-orchid/30 flex items-center justify-center text-sm font-medium text-orchid">
              E
            </div>
            <div className="text-sm">
              <p className="font-medium text-light/90">Elliot</p>
              <p className="text-light/40 text-xs">Plan Pro</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-[1200px] mx-auto px-8 py-8">{children}</div>
      </main>
    </div>
  );
}

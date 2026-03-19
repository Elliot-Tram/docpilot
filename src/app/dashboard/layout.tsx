"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Onboarding from "./onboarding";

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
  {
    label: "Base de connaissances",
    href: "/dashboard/knowledge",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h5l2 2h5a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z" />
        <path d="M8 11h4M8 14h2" />
      </svg>
    ),
  },
  {
    label: "Veille concurrentielle",
    href: "/dashboard/competitors",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="10" r="7" />
        <path d="M10 6v4l3 2" />
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
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("docpilot-onboarding-dismissed");
    if (!dismissed) setShowOnboarding(true);
  }, []);

  const [demoStep, setDemoStep] = useState(0);

  // Sync demo step from sessionStorage on navigation
  useEffect(() => {
    if (!showOnboarding) return;
    const step = sessionStorage.getItem("docpilot-onboarding-step");
    setDemoStep(step ? parseInt(step, 10) : 0);
  }, [pathname, showOnboarding]);

  function dismissOnboarding() {
    setShowOnboarding(false);
    sessionStorage.setItem("docpilot-onboarding-dismissed", "true");
  }

  // Map onboarding step to which sidebar href should pulse
  const demoHighlight: Record<number, string> = {
    0: "/dashboard/suggestions",
    1: "/dashboard/knowledge",
    2: "/dashboard/competitors",
    3: "/dashboard/competitors",
  };

  return (
    <div className="min-h-screen bg-light flex">
      {/* Sidebar */}
      <aside className="w-64 bg-dark text-light flex flex-col shrink-0 h-screen sticky top-0">
        <div className="px-6 h-16 flex items-center border-b border-white/10 shrink-0">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            doc<span className="text-orchid">pilot</span>
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            const shouldPulse =
              showOnboarding && demoHighlight[demoStep] === item.href && !isActive;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-white/10 text-light"
                    : shouldPulse
                    ? "text-orchid bg-orchid/10 animate-pulse"
                    : "text-light/50 hover:text-light hover:bg-white/5"
                }`}
              >
                {item.icon}
                {item.label}
                {shouldPulse && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-orchid animate-ping" />
                )}
                {!shouldPulse && item.badge && (
                  <span className="ml-auto bg-orchid/30 text-orchid text-xs font-medium px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-white/10 space-y-3 shrink-0">
          <button
            onClick={() => {
              sessionStorage.clear();
              window.location.href = "/dashboard";
            }}
            className="flex items-center gap-2 px-3 py-2 w-full rounded-lg text-sm text-light/30 hover:text-light/60 hover:bg-white/5 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6 4l10 6-10 6V4z" />
            </svg>
            Relancer la demo
          </button>
          <div className="flex items-center gap-3 px-3">
            <div className="w-8 h-8 rounded-full bg-orchid/30 flex items-center justify-center text-sm font-medium text-orchid shrink-0">
              E
            </div>
            <div className="text-sm min-w-0">
              <p className="font-medium text-light/90 truncate">Elliot</p>
              <p className="text-light/40 text-xs truncate">Plan Pro</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-[1200px] mx-auto px-8 py-8">
          {showOnboarding && (
            <Onboarding onDismiss={dismissOnboarding} />
          )}
          {children}
        </div>
      </main>
    </div>
  );
}

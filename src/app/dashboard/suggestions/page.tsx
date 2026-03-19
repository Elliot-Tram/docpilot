"use client";

import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import type { SuggestedArticle, ArticleStatus } from "@/lib/mock-data";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const statusLabel: Record<string, string> = {
  draft: "Brouillon",
  approved: "Approuvé",
  published: "Publié",
  rejected: "Rejeté",
};

const statusColor: Record<string, string> = {
  draft: "bg-sand text-dark/70",
  approved: "bg-mint text-dark/70",
  published: "bg-sky text-dark/70",
  rejected: "bg-coral/20 text-coral",
};

const filters: { label: string; value: ArticleStatus | "all" }[] = [
  { label: "Toutes", value: "all" },
  { label: "Brouillons", value: "draft" },
  { label: "Approuvés", value: "approved" },
  { label: "Publiés", value: "published" },
];

export default function SuggestionsPage() {
  const { data: articlesData } = useSWR<SuggestedArticle[]>("/api/articles", fetcher);
  const articles = Array.isArray(articlesData) ? articlesData : [];
  const [activeFilter, setActiveFilter] = useState<ArticleStatus | "all">(
    "all"
  );

  const filtered =
    activeFilter === "all"
      ? articles
      : articles.filter((a) => a.status === activeFilter);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-medium tracking-[-0.5px]">
            Suggestions d&apos;articles
          </h1>
          <p className="text-dark/50 mt-1">
            Articles générés automatiquement depuis vos tickets support
          </p>
        </div>
        <span className="font-mono text-sm bg-orchid/15 text-accent-purple px-4 py-1.5 rounded-full">
          {articles.length} articles
        </span>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              activeFilter === f.value
                ? "bg-dark text-light"
                : "bg-dark/5 text-dark/50 hover:bg-dark/10"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {articles.length === 0 && (
        <div className="bg-lift rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] p-12 text-center">
          <p className="text-dark/40 mb-2">Aucune suggestion pour le moment</p>
          <p className="text-sm text-dark/30">
            Les articles seront générés automatiquement après l&apos;import de vos tickets.
          </p>
        </div>
      )}

      {/* Articles grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((article) => (
          <Link
            key={article.id}
            href={`/dashboard/suggestions/${article.id}`}
            className="bg-lift rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.03)] hover:scale-[1.015] transition-transform duration-200 block"
          >
            <div className="flex items-start justify-between mb-3">
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  statusColor[article.status]
                }`}
              >
                {statusLabel[article.status]}
              </span>
              <span className="font-mono text-xs text-dark/30">
                {article.createdAt}
              </span>
            </div>
            <h3 className="text-base font-medium tracking-[-0.3px] mb-2">
              {article.title}
            </h3>
            <p className="text-sm text-dark/50 font-light leading-relaxed mb-4">
              {article.summary}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs bg-dark/5 text-dark/50 px-2.5 py-1 rounded-md">
                  {article.category}
                </span>
                <span className="text-xs text-dark/40">
                  {article.ticketCount} tickets
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-12 h-1.5 rounded-full bg-dark/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-accent-purple"
                    style={{ width: `${article.confidence}%` }}
                  />
                </div>
                <span className="text-xs text-dark/40">
                  {article.confidence}%
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

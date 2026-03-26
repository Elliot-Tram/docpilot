"use client";

import useSWR from "swr";
import Link from "next/link";
import type { SuggestedArticle, ArticleSource } from "@/lib/mock-data";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const originLabel: Record<string, string> = {
  tickets: "Tickets",
  veille: "Veille",
  both: "Tickets + Veille",
};

const originColor: Record<string, string> = {
  tickets: "bg-sky/10 text-sky",
  veille: "bg-orchid/10 text-accent-purple",
  both: "bg-mint/10 text-dark/75",
};

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

interface Stats {
  ticketsAnalyzed: number;
  articlesGenerated: number;
  gapsDetected: number;
  ticketsDeflected: number;
}

export default function DashboardOverview() {
  const { data: stats } = useSWR<Stats>("/api/stats", fetcher);
  const { data: articlesData } = useSWR<SuggestedArticle[]>("/api/articles", fetcher);
  const articles = Array.isArray(articlesData) ? articlesData : [];

  const statCards = stats
    ? [
        {
          label: "Tickets analysés",
          value: stats.ticketsAnalyzed.toLocaleString("fr-FR"),
        },
        { label: "Articles générés", value: stats.articlesGenerated },
        { label: "Gaps détectés", value: stats.gapsDetected },
        { label: "Tickets déviés", value: stats.ticketsDeflected },
      ]
    : [];

  const recentArticles = articles.slice(0, 4);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-medium tracking-[-0.5px]">
          Vue d&apos;ensemble
        </h1>
        <p className="text-dark/75 mt-1">
          Activite de votre help center automatise
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statCards.length > 0
          ? statCards.map((s) => (
              <div
                key={s.label}
                className="bg-lift rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.03)]"
              >
                <p className="text-sm text-dark/70 font-medium mb-2">{s.label}</p>
                <p className="text-3xl font-semibold tracking-tight">{s.value}</p>
              </div>
            ))
          : [0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-lift rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.03)] animate-pulse"
              >
                <div className="h-4 w-24 bg-dark/5 rounded mb-3" />
                <div className="h-8 w-16 bg-dark/5 rounded" />
              </div>
            ))}
      </div>

      {/* Empty state */}
      {articles.length === 0 && (
        <div className="bg-lift rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] p-12 text-center">
          <p className="text-dark/70 mb-2">Aucun article pour le moment</p>
          <p className="text-sm text-dark/65">
            Connectez une source de tickets pour commencer.
          </p>
          <Link
            href="/dashboard/sources"
            className="inline-block mt-4 bg-dark text-light px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-accent-purple transition-colors duration-300"
          >
            Ajouter une source
          </Link>
        </div>
      )}

      {/* Recent suggestions */}
      {recentArticles.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Suggestions récentes</h2>
            <Link
              href="/dashboard/suggestions"
              className="text-sm text-accent-purple hover:underline"
            >
              Voir toutes
            </Link>
          </div>
          <div className="bg-lift rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark/5">
                  <th className="text-left text-xs font-medium text-dark/70 uppercase tracking-wider px-6 py-3">
                    Article
                  </th>
                  <th className="text-left text-xs font-medium text-dark/70 uppercase tracking-wider px-6 py-3">
                    Catégorie
                  </th>
                  <th className="text-left text-xs font-medium text-dark/70 uppercase tracking-wider px-6 py-3">
                    Tickets
                  </th>
                  <th className="text-left text-xs font-medium text-dark/70 uppercase tracking-wider px-6 py-3">
                    Confiance
                  </th>
                  <th className="text-left text-xs font-medium text-dark/70 uppercase tracking-wider px-6 py-3">
                    Source
                  </th>
                  <th className="text-left text-xs font-medium text-dark/70 uppercase tracking-wider px-6 py-3">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentArticles.map((article) => (
                  <tr
                    key={article.id}
                    className="border-b border-dark/5 last:border-0 hover:bg-dark/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/dashboard/suggestions/${article.id}`}
                        className="font-medium text-sm hover:text-accent-purple transition-colors"
                      >
                        {article.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-dark/75">
                        {article.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium">
                        {article.ticketCount}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-dark/10 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-accent-purple"
                            style={{ width: `${article.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-dark/70">
                          {article.confidence}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {article.origin && (
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                            originColor[article.origin] || "bg-dark/5 text-dark/70"
                          }`}
                        >
                          {originLabel[article.origin] || article.origin}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          statusColor[article.status]
                        }`}
                      >
                        {statusLabel[article.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

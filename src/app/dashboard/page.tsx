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
  tickets: "bg-blue-100 text-blue-700",
  veille: "bg-orchid/10 text-accent-purple",
  both: "bg-emerald-100 text-emerald-700",
};

const statusLabel: Record<string, string> = {
  draft: "Brouillon",
  approved: "Approuvé",
  published: "Publié",
  rejected: "Rejeté",
};

const statusColor: Record<string, string> = {
  draft: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  published: "bg-blue-100 text-blue-700",
  rejected: "bg-coral/20 text-coral",
};

const pipelineSteps = [
  { key: "new", label: "Nouveaux drafts", color: "bg-sand" },
  { key: "waiting", label: "Attente expert", color: "bg-orchid/20" },
  { key: "responded", label: "Expert a repondu", color: "bg-sky/20" },
  { key: "approved", label: "Approuves", color: "bg-mint/30" },
  { key: "published", label: "Publies", color: "bg-mint" },
];

export default function DashboardOverview() {
  const { data: articlesData } = useSWR<SuggestedArticle[]>("/api/articles", fetcher);
  const articles = Array.isArray(articlesData) ? articlesData : [];

  const approved = articles.filter((a) => a.status === "approved");
  const published = articles.filter((a) => a.status === "published");
  const withCollabWaiting = articles.filter(
    (a) => a.status === "draft" && a.collaboration && !a.collaboration.expertResponse
  );
  const withCollabResponded = articles.filter(
    (a) => a.status === "draft" && a.collaboration && a.collaboration.expertResponse
  );
  const draftsNoCollab = articles.filter(
    (a) => a.status === "draft" && !a.collaboration
  );

  // Pipeline: each article is in exactly ONE stage
  const pipeline = [
    { count: draftsNoCollab.length, label: "Nouveaux drafts" },
    { count: withCollabWaiting.length, label: "Attente expert" },
    { count: withCollabResponded.length, label: "Expert a repondu" },
    { count: approved.length, label: "Approuves" },
    { count: published.length, label: "Publies" },
  ];

  const recentArticles = articles.slice(0, 6);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-medium tracking-[-0.5px]">
          Vue d&apos;ensemble
        </h1>
        <p className="text-dark/85 mt-1">
          Pipeline de votre help center automatise
        </p>
      </div>

      {/* Stats cards - workflow oriented */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-lift rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.03)]">
          <p className="text-sm text-dark/80 font-medium mb-2">Articles generes</p>
          <p className="text-3xl font-semibold tracking-tight">{articles.length}</p>
          <p className="text-xs text-dark/80 mt-1">{articles.filter(a => a.origin === "veille").length} via veille concurrentielle</p>
        </div>
        <div className="bg-lift rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.03)]">
          <p className="text-sm text-dark/80 font-medium mb-2">En attente d&apos;expert</p>
          <p className="text-3xl font-semibold tracking-tight">{withCollabWaiting.length}</p>
          <p className="text-xs text-dark/80 mt-1">{withCollabResponded.length} experts ont repondu</p>
        </div>
        <div className="bg-lift rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.03)]">
          <p className="text-sm text-dark/80 font-medium mb-2">Valides et publies</p>
          <p className="text-3xl font-semibold tracking-tight text-emerald-600">{approved.length + published.length}</p>
          <p className="text-xs text-dark/80 mt-1">{published.length} en ligne sur le help center</p>
        </div>
        <div className="bg-lift rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.03)]">
          <p className="text-sm text-dark/80 font-medium mb-2">Tickets devies (est.)</p>
          <p className="text-3xl font-semibold tracking-tight">482</p>
          <p className="text-xs text-dark/80 mt-1">~7 200 EUR/mois economises</p>
        </div>
      </div>

      {/* Pipeline visualization */}
      {articles.length > 0 && (
        <div className="bg-lift rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] p-6 mb-8">
          <h2 className="text-sm font-medium text-dark/80 mb-5">Pipeline de creation</h2>
          <div className="flex items-center gap-2">
            {pipeline.map((step, i) => (
              <div key={step.label} className="flex-1 flex items-center">
                <div className={`flex-1 rounded-xl ${pipelineSteps[i].color} p-4 text-center`}>
                  <p className="text-2xl font-semibold tracking-tight">{step.count}</p>
                  <p className="text-xs text-dark/80 font-medium mt-0.5">{step.label}</p>
                </div>
                {i < pipeline.length - 1 && (
                  <svg className="w-5 h-5 text-dark/20 shrink-0 mx-1" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 4l6 6-6 6" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {articles.length === 0 && (
        <div className="bg-lift rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] p-12 text-center">
          <p className="text-dark/80 mb-2">Aucun article pour le moment</p>
          <p className="text-sm text-dark/80">
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
            <h2 className="text-lg font-medium">Suggestions recentes</h2>
            <Link
              href="/dashboard/suggestions"
              className="text-sm text-accent-purple hover:underline"
            >
              Voir les {articles.length} articles
            </Link>
          </div>
          <div className="bg-lift rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark/5">
                  <th className="text-left text-xs font-medium text-dark/80 uppercase tracking-wider px-6 py-3">
                    Article
                  </th>
                  <th className="text-left text-xs font-medium text-dark/80 uppercase tracking-wider px-6 py-3">
                    Categorie
                  </th>
                  <th className="text-left text-xs font-medium text-dark/80 uppercase tracking-wider px-6 py-3">
                    Tickets
                  </th>
                  <th className="text-left text-xs font-medium text-dark/80 uppercase tracking-wider px-6 py-3">
                    Confiance
                  </th>
                  <th className="text-left text-xs font-medium text-dark/80 uppercase tracking-wider px-6 py-3">
                    Source
                  </th>
                  <th className="text-left text-xs font-medium text-dark/80 uppercase tracking-wider px-6 py-3">
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
                      <span className="font-mono text-xs text-dark/85">
                        {article.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {article.ticketCount > 0 ? (
                        <span className="text-sm font-medium">
                          {article.ticketCount}
                        </span>
                      ) : (
                        <span className="text-xs text-accent-purple font-medium">
                          via Aircall
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-dark/10 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-accent-purple"
                            style={{ width: `${article.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-dark/80">
                          {article.confidence}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {article.origin && (
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                            originColor[article.origin] || "bg-dark/5 text-dark/80"
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

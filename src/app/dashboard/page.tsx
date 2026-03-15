import { mockStats, mockArticles } from "@/lib/mock-data";
import Link from "next/link";

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

const stats = [
  {
    label: "Tickets analysés",
    value: mockStats.ticketsAnalyzed.toLocaleString("fr-FR"),
    color: "bg-orchid/15 text-accent-purple",
  },
  {
    label: "Articles générés",
    value: mockStats.articlesGenerated,
    color: "bg-mint/20 text-dark",
  },
  {
    label: "Gaps détectés",
    value: mockStats.gapsDetected,
    color: "bg-coral/15 text-dark",
  },
  {
    label: "Tickets déviés",
    value: mockStats.ticketsDeflected,
    color: "bg-sky/20 text-dark",
  },
];

export default function DashboardOverview() {
  const recentArticles = mockArticles.slice(0, 4);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-medium tracking-[-0.5px]">
          Vue d&apos;ensemble
        </h1>
        <p className="text-dark/50 mt-1">
          Activité de votre help center automatisé
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-lift rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.03)]"
          >
            <p className="text-sm text-dark/40 font-medium mb-2">{s.label}</p>
            <p className="text-3xl font-semibold tracking-tight">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Recent suggestions */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Suggestions récentes</h2>
        <Link
          href="/dashboard/suggestions"
          className="text-sm text-accent-purple hover:underline"
        >
          Voir toutes →
        </Link>
      </div>
      <div className="bg-lift rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark/5">
              <th className="text-left text-xs font-medium text-dark/40 uppercase tracking-wider px-6 py-3">
                Article
              </th>
              <th className="text-left text-xs font-medium text-dark/40 uppercase tracking-wider px-6 py-3">
                Catégorie
              </th>
              <th className="text-left text-xs font-medium text-dark/40 uppercase tracking-wider px-6 py-3">
                Tickets
              </th>
              <th className="text-left text-xs font-medium text-dark/40 uppercase tracking-wider px-6 py-3">
                Confiance
              </th>
              <th className="text-left text-xs font-medium text-dark/40 uppercase tracking-wider px-6 py-3">
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
                  <span className="font-mono text-xs text-dark/50">
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
                    <span className="text-xs text-dark/40">
                      {article.confidence}%
                    </span>
                  </div>
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
    </div>
  );
}

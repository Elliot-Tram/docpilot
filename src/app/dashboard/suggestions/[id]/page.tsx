"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { useParams, useRouter } from "next/navigation";
import type { SuggestedArticle, ArticleStatus } from "@/lib/mock-data";

const fetcher = (url: string) => fetch(url).then((r) => {
  if (!r.ok) throw new Error("Not found");
  return r.json();
});

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

export default function ArticleDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: article, error } = useSWR<SuggestedArticle>(
    id ? `/api/articles/${id}` : null,
    fetcher
  );
  const [status, setStatus] = useState<ArticleStatus>("draft");
  const [content, setContent] = useState("");
  const [showSuccess, setShowSuccess] = useState("");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (article && !initialized) {
      setStatus(article.status);
      setContent(article.content);
      setInitialized(true);
    }
  }, [article, initialized]);

  async function handleAction(newStatus: ArticleStatus, message: string) {
    await fetch(`/api/articles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus, content }),
    });
    setStatus(newStatus);
    setShowSuccess(message);
    setTimeout(() => setShowSuccess(""), 3000);
  }

  async function handleSave() {
    await fetch(`/api/articles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    setShowSuccess("Modifications enregistrées");
    setTimeout(() => setShowSuccess(""), 3000);
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-dark/40">Article introuvable.</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-96 bg-dark/5 rounded" />
        <div className="h-4 w-64 bg-dark/5 rounded" />
        <div className="bg-lift rounded-2xl p-6 space-y-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 bg-dark/5 rounded" style={{ width: `${80 - i * 10}%` }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => router.push("/dashboard/suggestions")}
          className="text-dark/40 hover:text-dark transition-colors"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 4l-8 6 8 6" />
          </svg>
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-medium tracking-[-0.5px]">
              {article.title}
            </h1>
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor[status]}`}
            >
              {statusLabel[status]}
            </span>
          </div>
          <p className="text-dark/40 text-sm mt-1">
            Généré le {article.createdAt} · {article.ticketCount} tickets
            associés · Confiance {article.confidence}%
          </p>
        </div>
      </div>

      {/* Success toast */}
      {showSuccess && (
        <div className="mb-6 bg-mint/20 text-dark border border-mint/40 px-4 py-3 rounded-xl text-sm font-medium">
          {showSuccess}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Article content */}
        <div className="lg:col-span-2">
          <div className="bg-lift rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] overflow-hidden">
            <div className="px-6 py-4 border-b border-dark/5 flex items-center justify-between">
              <h2 className="text-sm font-medium text-dark/60">
                Contenu de l&apos;article
              </h2>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-dark/30">Markdown</span>
                {content !== article.content && (
                  <button
                    onClick={handleSave}
                    className="text-xs bg-accent-purple text-light px-3 py-1 rounded-md hover:bg-dark transition-colors"
                  >
                    Sauvegarder
                  </button>
                )}
              </div>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-6 py-5 text-sm font-mono leading-relaxed text-dark/80 bg-transparent resize-none focus:outline-none min-h-[500px]"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-4">
            {status === "draft" && (
              <>
                <button
                  onClick={() =>
                    handleAction("approved", "Article approuvé avec succès !")
                  }
                  className="bg-dark text-light px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-accent-purple transition-colors duration-300"
                >
                  Approuver
                </button>
                <button
                  onClick={() => handleAction("rejected", "Article rejeté.")}
                  className="bg-dark/5 text-dark/60 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-dark/10 transition-colors duration-300"
                >
                  Rejeter
                </button>
              </>
            )}
            {status === "approved" && (
              <button
                onClick={() =>
                  handleAction(
                    "published",
                    "Article publié sur votre help center !"
                  )
                }
                className="bg-dark text-light px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-accent-purple transition-colors duration-300"
              >
                Publier sur le help center
              </button>
            )}
            {status === "published" && (
              <span className="text-sm text-dark/40 flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-mint"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 10l4 4 6-7" />
                </svg>
                Publié
              </span>
            )}
            {status === "rejected" && (
              <button
                onClick={() =>
                  handleAction("draft", "Article remis en brouillon.")
                }
                className="bg-dark/5 text-dark/60 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-dark/10 transition-colors duration-300"
              >
                Remettre en brouillon
              </button>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-lift rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] p-6">
            <h3 className="text-sm font-medium text-dark/60 mb-4">
              Résumé IA
            </h3>
            <p className="text-sm text-dark/50 font-light leading-relaxed">
              {article.summary}
            </p>
          </div>

          <div className="bg-lift rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] p-6">
            <h3 className="text-sm font-medium text-dark/60 mb-4">
              Tickets source ({article.sourceTickets.length})
            </h3>
            <div className="space-y-3">
              {article.sourceTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="border border-dark/5 rounded-xl p-3"
                >
                  <p className="text-sm font-medium mb-1">{ticket.subject}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-dark/40">
                      {ticket.customer}
                    </span>
                    <span className="font-mono text-xs text-dark/30">
                      {ticket.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-lift rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] p-6">
            <h3 className="text-sm font-medium text-dark/60 mb-3">Détails</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-dark/40">Catégorie</dt>
                <dd className="font-mono text-xs bg-dark/5 px-2 py-0.5 rounded">
                  {article.category}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-dark/40">Tickets associés</dt>
                <dd className="font-medium">{article.ticketCount}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-dark/40">Confiance IA</dt>
                <dd className="font-medium">{article.confidence}%</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-dark/40">Créé le</dt>
                <dd className="text-dark/60">{article.createdAt}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

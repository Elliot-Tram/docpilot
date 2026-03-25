"use client";

import { useState } from "react";
import useSWR from "swr";
import type { ConnectedSource } from "@/lib/mock-data";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const sourceSvgs: Record<string, React.ReactNode> = {
  zendesk: (
    <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none">
      <path d="M15 7v14.4L4 27V12.6L15 7z" fill="#03363D"/>
      <circle cx="9.5" cy="9" r="3.5" fill="#03363D"/>
      <path d="M17 27V12.6L28 7v14.4L17 27z" fill="#03363D"/>
      <circle cx="22.5" cy="25" r="3.5" fill="#03363D"/>
    </svg>
  ),
  intercom: (
    <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none">
      <rect x="4" y="4" width="24" height="24" rx="6" fill="#1F8DED"/>
      <rect x="9" y="10" width="2" height="10" rx="1" fill="white"/>
      <rect x="13" y="8" width="2" height="14" rx="1" fill="white"/>
      <rect x="17" y="8" width="2" height="14" rx="1" fill="white"/>
      <rect x="21" y="10" width="2" height="10" rx="1" fill="white"/>
      <path d="M9 23c2 1.5 5 2.5 7 2.5s5-1 7-2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  freshdesk: (
    <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none">
      <rect x="4" y="4" width="24" height="24" rx="6" fill="#2AB67B"/>
      <path d="M12 12h8M12 16h6M12 20h4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
};

const sourceLogos: Record<string, { label: string; color: string }> = {
  zendesk: { label: "Zendesk", color: "bg-white" },
  intercom: { label: "Intercom", color: "bg-white" },
  freshdesk: { label: "Freshdesk", color: "bg-white" },
};

const statusConfig: Record<string, { label: string; color: string }> = {
  connected: { label: "Connecté", color: "bg-mint text-dark/70" },
  syncing: { label: "Synchronisation...", color: "bg-sand text-dark/70" },
  disconnected: { label: "Déconnecté", color: "bg-dark/10 text-dark/40" },
  error: { label: "Erreur", color: "bg-coral/20 text-coral" },
};

const availableSources = [
  {
    type: "zendesk" as const,
    name: "Zendesk",
    description: "Importez vos tickets Zendesk Support",
    color: "bg-sand",
    fields: [
      { key: "subdomain", label: "Sous-domaine", placeholder: "votrecompany (dans votrecompany.zendesk.com)" },
      { key: "email", label: "Email admin", placeholder: "admin@votrecompany.com" },
      { key: "apiKey", label: "Clé API", placeholder: "Disponible dans Admin > API" },
    ],
  },
  {
    type: "intercom" as const,
    name: "Intercom",
    description: "Connectez vos conversations Intercom",
    color: "bg-sky/30",
    fields: [
      { key: "apiKey", label: "Access Token", placeholder: "Disponible dans Developer Hub > Your App" },
    ],
  },
  {
    type: "freshdesk" as const,
    name: "Freshdesk",
    description: "Synchronisez vos tickets Freshdesk",
    color: "bg-mint/30",
    fields: [
      { key: "subdomain", label: "Sous-domaine", placeholder: "votrecompany (dans votrecompany.freshdesk.com)" },
      { key: "apiKey", label: "Clé API", placeholder: "Disponible dans Profil > API Key" },
    ],
  },
];

export default function SourcesPage() {
  const { data: sourcesData, mutate } = useSWR<ConnectedSource[]>("/api/sources", fetcher);
  const sources = Array.isArray(sourcesData) ? sourcesData : [];
  const [showConnect, setShowConnect] = useState(false);
  const [selectedType, setSelectedType] = useState<typeof availableSources[number] | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [formName, setFormName] = useState("");
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  async function handleConnect(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedType) return;
    setFormLoading(true);
    setFormError("");

    const credentials: Record<string, string> = { apiKey: formData.apiKey || "" };
    if (formData.subdomain) credentials.subdomain = formData.subdomain;
    if (formData.email) credentials.email = formData.email;

    const res = await fetch("/api/sources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formName || `${selectedType.name} Production`,
        type: selectedType.type,
        credentials,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setFormError(data.error || "Erreur de connexion");
      setFormLoading(false);
      return;
    }

    setFormLoading(false);
    setSelectedType(null);
    setShowConnect(false);
    setFormData({});
    setFormName("");
    mutate();
  }

  async function handleSync(sourceId: string) {
    await fetch(`/api/sources/${sourceId}/sync`, { method: "POST" });
    mutate();
  }

  async function handleDelete(sourceId: string) {
    await fetch(`/api/sources/${sourceId}`, { method: "DELETE" });
    mutate();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-medium tracking-[-0.5px]">Sources</h1>
          <p className="text-dark/50 mt-1">
            Gérez vos connexions aux outils de support
          </p>
        </div>
        <button
          onClick={() => { setShowConnect(!showConnect); setSelectedType(null); }}
          className="bg-dark text-light px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-accent-purple transition-colors duration-300"
        >
          + Ajouter une source
        </button>
      </div>

      {/* Source type selection */}
      {showConnect && !selectedType && (
        <div className="bg-lift rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">
            Connecter une nouvelle source
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {availableSources.map((source) => (
              <button
                key={source.type}
                onClick={() => setSelectedType(source)}
                className="border border-dark/8 rounded-xl p-5 text-left hover:border-orchid/40 transition-all duration-200 hover:scale-[1.02]"
              >
                <div
                  className="w-10 h-10 rounded-xl bg-white border border-dark/5 flex items-center justify-center mb-3"
                >
                  {sourceSvgs[source.type] || (
                    <span className="text-sm font-semibold">
                      {source.name[0]}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-medium mb-1">{source.name}</h3>
                <p className="text-xs text-dark/40 font-light">
                  {source.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Connection form */}
      {showConnect && selectedType && (
        <div className="bg-lift rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setSelectedType(null)}
              className="text-dark/40 hover:text-dark transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 4l-8 6 8 6" />
              </svg>
            </button>
            <h2 className="text-lg font-medium">
              Connecter {selectedType.name}
            </h2>
          </div>
          <form onSubmit={handleConnect} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-dark/70 mb-1.5">
                Nom de la connexion
              </label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder={`${selectedType.name} Production`}
                className="w-full px-4 py-2.5 rounded-lg border border-dark/10 bg-white text-dark placeholder:text-dark/30 focus:outline-none focus:ring-2 focus:ring-orchid transition-all"
              />
            </div>
            {selectedType.fields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-dark/70 mb-1.5">
                  {field.label}
                </label>
                <input
                  type={field.key === "apiKey" ? "password" : "text"}
                  required
                  value={formData[field.key] || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, [field.key]: e.target.value })
                  }
                  placeholder={field.placeholder}
                  className="w-full px-4 py-2.5 rounded-lg border border-dark/10 bg-white text-dark placeholder:text-dark/30 focus:outline-none focus:ring-2 focus:ring-orchid transition-all"
                />
              </div>
            ))}
            {formError && (
              <p className="text-coral text-sm">{formError}</p>
            )}
            <button
              type="submit"
              disabled={formLoading}
              className="bg-dark text-light px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-accent-purple transition-colors duration-300 disabled:opacity-50"
            >
              {formLoading ? "Test de connexion..." : "Connecter"}
            </button>
          </form>
        </div>
      )}

      {/* Connected sources */}
      {sources.length === 0 && !showConnect && (
        <div className="bg-lift rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] p-12 text-center">
          <p className="text-dark/40 mb-2">Aucune source connectée</p>
          <p className="text-sm text-dark/30">
            Ajoutez votre premier outil de support pour commencer.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {sources.map((source) => (
          <div
            key={source.id}
            className="bg-lift rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] p-6 flex items-center gap-6"
          >
            <div
              className="w-12 h-12 rounded-xl bg-white border border-dark/5 flex items-center justify-center shrink-0"
            >
              {sourceSvgs[source.type] || (
                <span className="text-lg font-semibold">
                  {sourceLogos[source.type]?.label[0] || "?"}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-base font-medium">{source.name}</h3>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    statusConfig[source.status]?.color || "bg-dark/10 text-dark/40"
                  }`}
                >
                  {statusConfig[source.status]?.label || source.status}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-dark/40">
                <span>
                  {source.ticketsImported.toLocaleString("fr-FR")} tickets importés
                </span>
                <span>·</span>
                <span>Dernière sync : {source.lastSync}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSync(source.id)}
                disabled={source.status === "syncing"}
                className="bg-dark/5 text-dark/60 px-4 py-2 rounded-lg text-sm font-medium hover:bg-dark/10 transition-colors disabled:opacity-50"
              >
                Sync
              </button>
              <button
                onClick={() => handleDelete(source.id)}
                className="text-dark/30 hover:text-coral transition-colors px-2 py-2"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 5l10 10M15 5L5 15" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

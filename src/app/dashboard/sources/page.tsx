"use client";

import { useState } from "react";
import useSWR from "swr";
import type { ConnectedSource } from "@/lib/mock-data";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const sourceSvgs: Record<string, React.ReactNode> = {
  zendesk: (
    <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
      <rect width="48" height="48" rx="12" fill="#03363D"/>
      <path d="M23 14v14.4L12 34V19.6L23 14z" fill="white"/>
      <circle cx="17.5" cy="16" r="3.5" fill="white"/>
      <path d="M25 34V19.6L36 14v14.4L25 34z" fill="white"/>
      <circle cx="30.5" cy="32" r="3.5" fill="white"/>
    </svg>
  ),
  intercom: (
    <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
      <rect width="48" height="48" rx="12" fill="#1F8DED"/>
      <rect x="13" y="15" width="2.5" height="12" rx="1.25" fill="white"/>
      <rect x="18" y="12" width="2.5" height="16" rx="1.25" fill="white"/>
      <rect x="23" y="12" width="2.5" height="16" rx="1.25" fill="white"/>
      <rect x="28" y="12" width="2.5" height="16" rx="1.25" fill="white"/>
      <rect x="33" y="15" width="2.5" height="12" rx="1.25" fill="white"/>
      <path d="M13 30c3 2 6.5 3.5 11 3.5s8-1.5 11-3.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  freshdesk: (
    <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
      <rect width="48" height="48" rx="12" fill="#2AB67B"/>
      <path d="M16 16h16M16 22h12M16 28h8" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  ),
  hubspot: (
    <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
      <rect width="48" height="48" rx="12" fill="#FF7A59"/>
      <circle cx="24" cy="24" r="5" stroke="white" strokeWidth="2"/>
      <circle cx="24" cy="24" r="2" fill="white"/>
      <path d="M24 19V14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="24" cy="12.5" r="2" fill="white"/>
      <path d="M28.5 21.5L32 18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <path d="M19.5 26.5L16 30" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="34" cy="16.5" r="2" fill="white"/>
      <circle cx="14" cy="31.5" r="2" fill="white"/>
    </svg>
  ),
  claap: (
    <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
      <rect width="48" height="48" rx="12" fill="#6C5CE7"/>
      <circle cx="24" cy="20" r="6" stroke="white" strokeWidth="2"/>
      <circle cx="24" cy="20" r="2.5" fill="white"/>
      <path d="M24 26v5M20 33h8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
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
  disconnected: { label: "Déconnecté", color: "bg-dark/10 text-dark/70" },
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
                <div className="w-10 h-10 rounded-xl overflow-hidden mb-3">
                  {sourceSvgs[source.type] || (
                    <div className="w-full h-full bg-dark/5 flex items-center justify-center">
                      <span className="text-sm font-semibold">
                        {source.name[0]}
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="text-sm font-medium mb-1">{source.name}</h3>
                <p className="text-xs text-dark/70 font-light">
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
              className="text-dark/70 hover:text-dark transition-colors"
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
                className="w-full px-4 py-2.5 rounded-lg border border-dark/10 bg-white text-dark placeholder:text-dark/65 focus:outline-none focus:ring-2 focus:ring-orchid transition-all"
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
                  className="w-full px-4 py-2.5 rounded-lg border border-dark/10 bg-white text-dark placeholder:text-dark/65 focus:outline-none focus:ring-2 focus:ring-orchid transition-all"
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
          <p className="text-dark/70 mb-2">Aucune source connectée</p>
          <p className="text-sm text-dark/65">
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
            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
              {sourceSvgs[source.type] || (
                <div className="w-full h-full bg-dark/5 flex items-center justify-center">
                  <span className="text-lg font-semibold">
                    {sourceLogos[source.type]?.label[0] || "?"}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-base font-medium">{source.name}</h3>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    statusConfig[source.status]?.color || "bg-dark/10 text-dark/70"
                  }`}
                >
                  {statusConfig[source.status]?.label || source.status}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-dark/70">
                <span>
                  {source.ticketsImported.toLocaleString("fr-FR")} {source.metricLabel || "tickets importés"}
                </span>
                <span>·</span>
                <span>Dernière sync : {source.lastSync}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSync(source.id)}
                disabled={source.status === "syncing"}
                className="bg-dark/5 text-dark/75 px-4 py-2 rounded-lg text-sm font-medium hover:bg-dark/10 transition-colors disabled:opacity-50"
              >
                Sync
              </button>
              <button
                onClick={() => handleDelete(source.id)}
                className="text-dark/65 hover:text-coral transition-colors px-2 py-2"
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

"use client";

import { useState } from "react";
import { mockSources } from "@/lib/mock-data";

const sourceLogos: Record<string, { label: string; color: string }> = {
  zendesk: { label: "Zendesk", color: "bg-sand" },
  intercom: { label: "Intercom", color: "bg-sky/30" },
  freshdesk: { label: "Freshdesk", color: "bg-mint/30" },
};

const statusConfig: Record<string, { label: string; color: string }> = {
  connected: { label: "Connecté", color: "bg-mint text-dark/70" },
  syncing: { label: "Synchronisation…", color: "bg-sand text-dark/70" },
  disconnected: { label: "Déconnecté", color: "bg-dark/10 text-dark/40" },
};

const availableSources = [
  {
    type: "zendesk",
    name: "Zendesk",
    description: "Importez vos tickets Zendesk Support",
    color: "bg-sand",
  },
  {
    type: "intercom",
    name: "Intercom",
    description: "Connectez vos conversations Intercom",
    color: "bg-sky/30",
  },
  {
    type: "freshdesk",
    name: "Freshdesk",
    description: "Synchronisez vos tickets Freshdesk",
    color: "bg-mint/30",
  },
];

export default function SourcesPage() {
  const [showConnect, setShowConnect] = useState(false);

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
          onClick={() => setShowConnect(!showConnect)}
          className="bg-dark text-light px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-accent-purple transition-colors duration-300"
        >
          + Ajouter une source
        </button>
      </div>

      {/* Connect modal */}
      {showConnect && (
        <div className="bg-lift rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">
            Connecter une nouvelle source
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {availableSources.map((source) => (
              <button
                key={source.type}
                className="border border-dark/8 rounded-xl p-5 text-left hover:border-orchid/40 transition-all duration-200 hover:scale-[1.02]"
              >
                <div
                  className={`w-10 h-10 rounded-xl ${source.color} flex items-center justify-center mb-3`}
                >
                  <span className="text-sm font-semibold">
                    {source.name[0]}
                  </span>
                </div>
                <h3 className="text-sm font-medium mb-1">{source.name}</h3>
                <p className="text-xs text-dark/40 font-light">
                  {source.description}
                </p>
              </button>
            ))}
          </div>
          <p className="text-xs text-dark/30 mt-4 font-light">
            La connexion OAuth se fera en quelques clics. Aucune donnée n&apos;est
            stockée avant votre approbation.
          </p>
        </div>
      )}

      {/* Connected sources */}
      <div className="space-y-4">
        {mockSources.map((source) => (
          <div
            key={source.id}
            className="bg-lift rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] p-6 flex items-center gap-6"
          >
            <div
              className={`w-12 h-12 rounded-xl ${
                sourceLogos[source.type].color
              } flex items-center justify-center shrink-0`}
            >
              <span className="text-lg font-semibold">
                {sourceLogos[source.type].label[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-base font-medium">{source.name}</h3>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    statusConfig[source.status].color
                  }`}
                >
                  {statusConfig[source.status].label}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-dark/40">
                <span>
                  {source.ticketsImported.toLocaleString("fr-FR")} tickets
                  importés
                </span>
                <span>·</span>
                <span>Dernière sync : {source.lastSync}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="bg-dark/5 text-dark/60 px-4 py-2 rounded-lg text-sm font-medium hover:bg-dark/10 transition-colors">
                Sync
              </button>
              <button className="text-dark/30 hover:text-coral transition-colors px-2 py-2">
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

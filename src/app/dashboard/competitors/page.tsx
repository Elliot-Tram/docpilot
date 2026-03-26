"use client";

import { useState, useCallback } from "react";

interface CompetitorAnalysis {
  name: string;
  url: string;
  articlesCount: number;
  score: number;
  coverageMap: { topic: string; them: boolean; you: boolean }[];
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  topicBreakdown: { label: string; them: number; you: number }[];
}

const mockCompetitors: CompetitorAnalysis[] = [
  {
    name: "Aircall",
    url: "https://support.aircall.io",
    articlesCount: 186,
    score: 78,
    coverageMap: [
      { topic: "Configuration initiale", them: true, you: true },
      { topic: "Gestion des numeros", them: true, you: true },
      { topic: "Integrations CRM", them: true, you: true },
      { topic: "Analytics et reporting", them: true, you: false },
      { topic: "Receptionniste IA / IVR", them: true, you: true },
      { topic: "API et webhooks", them: true, you: true },
      { topic: "Administration equipe", them: true, you: true },
      { topic: "Troubleshooting reseau/audio", them: true, you: false },
      { topic: "Conformite et securite (RGPD)", them: true, you: false },
      { topic: "Migration depuis un autre outil", them: true, you: false },
      { topic: "App mobile", them: true, you: false },
      { topic: "Bonnes pratiques par secteur", them: false, you: false },
      { topic: "Tutoriels video", them: true, you: false },
    ],
    strengths: [
      "186 articles bien structures avec une base de connaissances tres mature",
      "Tutoriels video integres dans la plupart des guides de configuration",
      "Section troubleshooting tres detaillee (qualite audio, reseau, compatibilite)",
      "Documentation multilingue (FR, EN, ES, DE) avec localisation soignee",
      "Guides de migration specifiques depuis les concurrents (Ringover, etc.)",
    ],
    weaknesses: [
      "Ton tres corporatif, peu chaleureux comparativement",
      "Navigation complexe : beaucoup de niveaux de sous-categories",
      "Pas de contenu oriente cas d'usage ou bonnes pratiques sectorielles",
      "Certains articles datent de plus de 2 ans sans mise a jour",
      "Pas de chatbot ou d'assistance IA dans le help center",
    ],
    opportunities: [
      "Creer des guides \"Migration depuis Aircall\" pour capter leurs clients insatisfaits",
      "Publier des articles sur l'analytics et le reporting (gap majeur chez vous)",
      "Ajouter du contenu troubleshooting audio/reseau (demande frequente des utilisateurs telephonie)",
      "Produire des guides de bonnes pratiques par secteur (immobilier, recrutement, e-commerce)",
      "Proposer des tutoriels video courts (format que les utilisateurs d'Aircall apprecient)",
    ],
    topicBreakdown: [
      { label: "Configuration", them: 42, you: 8 },
      { label: "Integrations", them: 31, you: 6 },
      { label: "Telephonie", them: 28, you: 5 },
      { label: "Admin / equipe", them: 24, you: 4 },
      { label: "Troubleshooting", them: 22, you: 0 },
      { label: "API / Dev", them: 18, you: 5 },
      { label: "Facturation", them: 12, you: 3 },
      { label: "Securite", them: 9, you: 0 },
    ],
  },
  {
    name: "Ringover",
    url: "https://support.ringover.com",
    articlesCount: 124,
    score: 65,
    coverageMap: [
      { topic: "Configuration initiale", them: true, you: true },
      { topic: "Gestion des numeros", them: true, you: true },
      { topic: "Integrations CRM", them: true, you: true },
      { topic: "Analytics et reporting", them: false, you: false },
      { topic: "Receptionniste IA / IVR", them: true, you: true },
      { topic: "API et webhooks", them: false, you: true },
      { topic: "Administration equipe", them: true, you: true },
      { topic: "Troubleshooting reseau/audio", them: true, you: false },
      { topic: "Conformite et securite (RGPD)", them: false, you: false },
      { topic: "Migration depuis un autre outil", them: false, you: false },
      { topic: "App mobile", them: true, you: false },
      { topic: "Bonnes pratiques par secteur", them: false, you: false },
      { topic: "Tutoriels video", them: true, you: false },
    ],
    strengths: [
      "Contenu bien adapte au marche francophone avec des exemples concrets",
      "Tutoriels video sur YouTube lies aux articles principaux",
      "Bonne couverture des fonctionnalites telephonie de base",
      "Interface du help center simple et facile a naviguer",
    ],
    weaknesses: [
      "Moins d'articles qu'Aircall, couverture moins exhaustive",
      "Pas de documentation API/developpeur",
      "Pas de guides de migration ni de contenu de conquete",
      "Mises a jour irreguliere, certains articles obsoletes",
      "Pas de section conformite/securite",
    ],
    opportunities: [
      "Votre documentation API est deja un avantage concurrentiel a capitaliser",
      "Creer du contenu conformite/RGPD (ni vous ni Ringover ne le couvrez)",
      "Publier des comparatifs objectifs qui mettent en avant vos differences",
      "Proposer des guides de migration depuis Ringover",
    ],
    topicBreakdown: [
      { label: "Configuration", them: 32, you: 8 },
      { label: "Integrations", them: 22, you: 6 },
      { label: "Telephonie", them: 25, you: 5 },
      { label: "Admin / equipe", them: 18, you: 4 },
      { label: "Troubleshooting", them: 15, you: 0 },
      { label: "API / Dev", them: 0, you: 5 },
      { label: "Facturation", them: 8, you: 3 },
      { label: "Securite", them: 0, you: 0 },
    ],
  },
];

const scanSteps = [
  "Connexion au help center concurrent...",
  "Indexation des articles publics (186 trouves)...",
  "Analyse de la couverture thematique...",
  "Comparaison avec votre base de connaissances...",
  "Detection des opportunites...",
  "Rapport pret !",
];

const stepDelays = [800, 1400, 1200, 1000, 1200, 0];

export default function CompetitorsPage() {
  const [competitors, setCompetitors] = useState<CompetitorAnalysis[]>([]);
  const [url, setUrl] = useState("https://support.aircall.io");
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [demoStep, setDemoStep] = useState<"intro" | "scan" | "done">("scan");
  const [selectedCompetitor, setSelectedCompetitor] =
    useState<CompetitorAnalysis | null>(null);

  const runScan = useCallback(() => {
    setScanning(true);
    setScanStep(0);

    let step = 0;
    function nextStep() {
      if (step >= scanSteps.length - 1) {
        setTimeout(() => {
          setScanning(false);
          const isAircall = url.toLowerCase().includes("aircall");
          const mock = isAircall ? mockCompetitors[0] : mockCompetitors[1];
          const result = { ...mock, url };
          setCompetitors((prev) => {
            const exists = prev.find((c) => c.name === result.name);
            if (exists) return prev;
            return [...prev, result];
          });
          setSelectedCompetitor(result);
          setUrl("");
        }, 800);
        return;
      }
      const delay = stepDelays[step] + Math.random() * 600 - 300;
      setTimeout(() => {
        step++;
        setScanStep(step);
        nextStep();
      }, delay);
    }
    nextStep();
  }, [url]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim() || scanning) return;
    setDemoStep("done");
    runScan();
  }

  const maxArticles = Math.max(
    ...((selectedCompetitor?.topicBreakdown || []).map((t) =>
      Math.max(t.them, t.you)
    )),
    1
  );

  const scanPromptActive = demoStep === "scan" && !scanning && competitors.length === 0;

  return (
    <div className="relative">
      {/* Intro modal */}
      {demoStep === "intro" && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8">
            <div className="w-12 h-12 rounded-xl bg-orchid/15 flex items-center justify-center mb-5">
              <span className="text-xl font-semibold text-accent-purple">vs</span>
            </div>
            <h2 className="text-xl font-semibold mb-3">
              Veille concurrentielle
            </h2>
            <p className="text-dark/60 leading-relaxed mb-3">
              Docpilot peut analyser le help center de vos concurrents et le comparer au votre.
            </p>
            <p className="text-dark/60 leading-relaxed mb-6">
              Vous verrez quels sujets ils couvrent et pas vous, leurs forces, leurs faiblesses,
              et les opportunites pour vous demarquer.
            </p>
            <button
              onClick={() => setDemoStep("scan")}
              className="w-full bg-dark text-light py-3 rounded-xl text-sm font-medium hover:bg-accent-purple transition-colors duration-300"
            >
              Lancer l&apos;analyse
            </button>
          </div>
        </div>
      )}

      {/* Scan prompt overlay */}
      {scanPromptActive && (
        <div className="fixed inset-0 bg-black/50 z-40" />
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-medium tracking-[-0.5px]">
          Veille concurrentielle
        </h1>
        <p className="text-dark/50 mt-1">
          Analysez les help centers de vos concurrents et identifiez vos
          opportunites
        </p>
      </div>

      {/* Add competitor */}
      <div className={`bg-lift rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] p-6 mb-6 transition-all duration-300 ${
        scanPromptActive ? "relative z-50 ring-2 ring-orchid shadow-[0_0_40px_rgba(168,85,247,0.25)]" : ""
      }`}>
        <h2 className="text-lg font-medium mb-1">Analyser un concurrent</h2>
        <p className="text-sm text-dark/40 mb-5">
          Entrez l&apos;URL du help center d&apos;un concurrent. Docpilot va
          comparer sa couverture avec la votre.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-3 max-w-2xl">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://support.concurrent.com"
            className="flex-1 px-4 py-2.5 rounded-lg border border-dark/10 bg-white text-dark placeholder:text-dark/30 focus:outline-none focus:ring-2 focus:ring-orchid transition-all"
            disabled={scanning}
          />
          <button
            type="submit"
            disabled={scanning || !url.trim()}
            className="bg-dark text-light px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-accent-purple transition-colors duration-300 disabled:opacity-50 whitespace-nowrap"
          >
            {scanning ? "Analyse..." : "Analyser"}
          </button>
        </form>
      </div>

      {/* Scan progress */}
      {scanning && (
        <div className="bg-lift rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] p-6 mb-6">
          <div className="space-y-3">
            {scanSteps.map((step, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 transition-all duration-300 ${
                  i <= scanStep ? "opacity-100" : "opacity-0"
                }`}
              >
                {i < scanStep ? (
                  <svg
                    className="w-5 h-5 text-mint shrink-0"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 10l4 4 6-7" />
                  </svg>
                ) : i === scanStep ? (
                  <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-orchid animate-pulse" />
                  </div>
                ) : (
                  <div className="w-5 h-5 shrink-0" />
                )}
                <span
                  className={`text-sm ${
                    i <= scanStep ? "text-dark/70" : "text-dark/20"
                  }`}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Competitor tabs */}
      {competitors.length > 0 && !scanning && (
        <div className="flex gap-2 mb-6">
          {competitors.map((c) => (
            <button
              key={c.name}
              onClick={() => setSelectedCompetitor(c)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                selectedCompetitor?.name === c.name
                  ? "bg-dark text-light"
                  : "bg-dark/5 text-dark/50 hover:bg-dark/10"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {/* Analysis results */}
      {selectedCompetitor && !scanning && (
        <div className="space-y-6">
          {/* Score overview */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-lift rounded-2xl p-5 shadow-[0_2px_20px_rgba(0,0,0,0.03)]">
              <p className="text-sm text-dark/40 font-medium mb-1">
                Leurs articles
              </p>
              <p className="text-2xl font-semibold tracking-tight">
                {selectedCompetitor.articlesCount}
              </p>
            </div>
            <div className="bg-lift rounded-2xl p-5 shadow-[0_2px_20px_rgba(0,0,0,0.03)]">
              <p className="text-sm text-dark/40 font-medium mb-1">
                Vos articles
              </p>
              <p className="text-2xl font-semibold tracking-tight">34</p>
            </div>
            <div className="bg-lift rounded-2xl p-5 shadow-[0_2px_20px_rgba(0,0,0,0.03)]">
              <p className="text-sm text-dark/40 font-medium mb-1">
                Score de couverture
              </p>
              <div className="flex items-end gap-2">
                <p className="text-2xl font-semibold tracking-tight">
                  {selectedCompetitor.score}%
                </p>
                <p className="text-sm text-dark/30 mb-0.5">vs eux</p>
              </div>
            </div>
          </div>

          {/* Coverage comparison bars */}
          <div className="bg-lift rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] p-6">
            <h3 className="text-base font-medium mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orchid" />
              Couverture par theme
            </h3>
            <div className="flex items-center gap-6 mb-4 text-xs text-dark/40">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-orchid/70" />
                {selectedCompetitor.name}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-mint" />
                Vous
              </div>
            </div>
            <div className="space-y-3">
              {selectedCompetitor.topicBreakdown.map((topic) => (
                <div key={topic.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-dark/60">{topic.label}</span>
                    <span className="text-xs text-dark/30 font-mono">
                      {topic.them} vs {topic.you}
                    </span>
                  </div>
                  <div className="flex gap-1 h-5">
                    <div
                      className="bg-orchid/20 rounded-l-md transition-all duration-500"
                      style={{
                        width: `${(topic.them / maxArticles) * 100}%`,
                        minWidth: topic.them > 0 ? "4px" : "0",
                      }}
                    />
                    <div
                      className="bg-mint rounded-r-md transition-all duration-500"
                      style={{
                        width: `${(topic.you / maxArticles) * 100}%`,
                        minWidth: topic.you > 0 ? "4px" : "0",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coverage map */}
          <div className="bg-lift rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] p-6">
            <h3 className="text-base font-medium mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky" />
              Matrice de couverture
            </h3>
            <div className="overflow-hidden rounded-xl border border-dark/5">
              <table className="w-full">
                <thead>
                  <tr className="bg-dark/[0.02]">
                    <th className="text-left text-xs font-medium text-dark/40 uppercase tracking-wider px-4 py-2.5">
                      Sujet
                    </th>
                    <th className="text-center text-xs font-medium text-dark/40 uppercase tracking-wider px-4 py-2.5">
                      {selectedCompetitor.name}
                    </th>
                    <th className="text-center text-xs font-medium text-dark/40 uppercase tracking-wider px-4 py-2.5">
                      Vous
                    </th>
                    <th className="text-center text-xs font-medium text-dark/40 uppercase tracking-wider px-4 py-2.5">
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCompetitor.coverageMap.map((row) => {
                    const status =
                      row.you && row.them
                        ? "couvert"
                        : row.them && !row.you
                        ? "gap"
                        : row.you && !row.them
                        ? "avantage"
                        : "absent";
                    const statusConfig = {
                      couvert: {
                        label: "Couvert",
                        class: "bg-mint/20 text-dark/50",
                      },
                      gap: {
                        label: "Gap a combler",
                        class: "bg-coral/15 text-coral font-medium",
                      },
                      avantage: {
                        label: "Votre avantage",
                        class: "bg-orchid/15 text-accent-purple font-medium",
                      },
                      absent: {
                        label: "Opportunite",
                        class: "bg-sand text-dark/50",
                      },
                    };
                    return (
                      <tr
                        key={row.topic}
                        className="border-t border-dark/5 hover:bg-dark/[0.01]"
                      >
                        <td className="px-4 py-2.5 text-sm text-dark/70">
                          {row.topic}
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          {row.them ? (
                            <svg
                              className="w-4 h-4 text-dark/30 mx-auto"
                              viewBox="0 0 20 20"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M5 10l4 4 6-7" />
                            </svg>
                          ) : (
                            <span className="text-dark/10">-</span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          {row.you ? (
                            <svg
                              className="w-4 h-4 text-mint mx-auto"
                              viewBox="0 0 20 20"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M5 10l4 4 6-7" />
                            </svg>
                          ) : (
                            <span className="text-dark/10">-</span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full ${statusConfig[status].class}`}
                          >
                            {statusConfig[status].label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-lift rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] p-6">
              <h3 className="text-base font-medium mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-mint" />
                Leurs forces
              </h3>
              <ul className="space-y-2">
                {selectedCompetitor.strengths.map((s, i) => (
                  <li
                    key={i}
                    className="text-sm text-dark/60 pl-4 border-l-2 border-mint/30"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="bg-lift rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] p-6">
              <h3 className="text-base font-medium mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-coral" />
                Leurs faiblesses
              </h3>
              <ul className="space-y-2">
                {selectedCompetitor.weaknesses.map((w, i) => (
                  <li
                    key={i}
                    className="text-sm text-dark/60 pl-4 border-l-2 border-coral/30"
                  >
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Opportunities */}
          <div className="bg-lift rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] p-6">
            <h3 className="text-base font-medium mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orchid" />
              Opportunites pour vous
            </h3>
            <div className="space-y-3">
              {selectedCompetitor.opportunities.map((o, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 text-sm text-dark/60 bg-orchid/5 rounded-lg px-4 py-3 border-l-2 border-orchid/40"
                >
                  <span className="text-orchid font-semibold shrink-0 mt-px">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {o}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {competitors.length === 0 && !scanning && (
        <div className="bg-lift rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] p-12 text-center">
          <p className="text-dark/40 mb-2">
            Aucun concurrent analyse pour le moment
          </p>
          <p className="text-sm text-dark/30">
            Ajoutez l&apos;URL d&apos;un help center concurrent pour voir la
            comparaison.
          </p>
        </div>
      )}
    </div>
  );
}

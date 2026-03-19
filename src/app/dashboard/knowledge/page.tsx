"use client";

import { useState, useEffect, useCallback } from "react";

interface BrandProfile {
  tone: string[];
  vocabulary: string[];
  structure: string[];
  insights: string[];
  articlesScanned: number;
  categories: string[];
}

const mockProfile: BrandProfile = {
  tone: [
    "Professionnel mais accessible, tutoiement evite",
    "Phrases courtes et directes, pas de jargon technique inutile",
    "Ton empathique en debut d'article (\"Vous rencontrez un probleme avec...\")",
    "Formulations positives privilegiees (\"Vous pouvez\" plutot que \"Vous ne pouvez pas\")",
  ],
  vocabulary: [
    "\"espace client\" (pas \"dashboard\" ou \"tableau de bord\")",
    "\"equipe support\" (pas \"service client\")",
    "\"parametres\" (pas \"configuration\" ou \"settings\")",
    "\"envoyer une demande\" (pas \"ouvrir un ticket\")",
    "\"formule\" (pas \"plan\" ou \"abonnement\")",
  ],
  structure: [
    "Titre H1 sous forme de question (\"Comment modifier mon mot de passe ?\")",
    "Introduction de 1-2 phrases qui reformule le probleme",
    "Etapes numerotees avec captures d'ecran",
    "Encadre \"Bon a savoir\" pour les informations complementaires",
    "Lien vers l'equipe support en conclusion",
  ],
  insights: [
    "73% des articles traitent de l'onboarding et la configuration initiale",
    "Le help center ne couvre pas les cas d'usage avances (API, integrations)",
    "12 articles n'ont pas ete mis a jour depuis plus de 6 mois",
    "Aucun article sur les nouveautes des 3 derniers mois",
  ],
  articlesScanned: 47,
  categories: [
    "Prise en main",
    "Mon compte",
    "Facturation",
    "Fonctionnalites",
    "Integrations",
    "Securite",
  ],
};

const scanSteps = [
  "Connexion au help center...",
  "Scan des articles publies...",
  "Analyse de la structure...",
  "Extraction du vocabulaire...",
  "Detection du ton redactionnel...",
  "Identification des lacunes...",
  "Profil redactionnel genere !",
];

export default function KnowledgePage() {
  const [url, setUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [profile, setProfile] = useState<BrandProfile | null>(null);

  const runScan = useCallback(() => {
    setScanning(true);
    setScanStep(0);
    setProfile(null);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setScanStep(step);
      if (step >= scanSteps.length - 1) {
        clearInterval(interval);
        setTimeout(() => {
          setScanning(false);
          setProfile(mockProfile);
        }, 600);
      }
    }, 800);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    runScan();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-medium tracking-[-0.5px]">
          Base de connaissances
        </h1>
        <p className="text-dark/50 mt-1">
          Connectez votre help center existant pour que Docpilot s&apos;adapte a
          votre style
        </p>
      </div>

      {/* URL input */}
      <div className="bg-lift rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] p-6 mb-6">
        <h2 className="text-lg font-medium mb-1">Help center existant</h2>
        <p className="text-sm text-dark/40 mb-5">
          Entrez l&apos;URL de votre help center. Docpilot va scanner vos
          articles pour en extraire le ton, le vocabulaire et la structure.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-3 max-w-2xl">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://help.votrecompany.com"
            className="flex-1 px-4 py-2.5 rounded-lg border border-dark/10 bg-white text-dark placeholder:text-dark/30 focus:outline-none focus:ring-2 focus:ring-orchid transition-all"
            disabled={scanning}
          />
          <button
            type="submit"
            disabled={scanning || !url.trim()}
            className="bg-dark text-light px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-accent-purple transition-colors duration-300 disabled:opacity-50 whitespace-nowrap"
          >
            {scanning ? "Analyse en cours..." : "Scanner"}
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

      {/* Profile results */}
      {profile && (
        <div className="space-y-6">
          {/* Stats bar */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-lift rounded-2xl p-5 shadow-[0_2px_20px_rgba(0,0,0,0.03)]">
              <p className="text-sm text-dark/40 font-medium mb-1">
                Articles scannes
              </p>
              <p className="text-2xl font-semibold tracking-tight">
                {profile.articlesScanned}
              </p>
            </div>
            <div className="bg-lift rounded-2xl p-5 shadow-[0_2px_20px_rgba(0,0,0,0.03)]">
              <p className="text-sm text-dark/40 font-medium mb-1">
                Categories detectees
              </p>
              <p className="text-2xl font-semibold tracking-tight">
                {profile.categories.length}
              </p>
            </div>
            <div className="bg-lift rounded-2xl p-5 shadow-[0_2px_20px_rgba(0,0,0,0.03)]">
              <p className="text-sm text-dark/40 font-medium mb-1">
                Profil pret
              </p>
              <p className="text-2xl font-semibold tracking-tight text-mint">
                Actif
              </p>
            </div>
          </div>

          {/* Tone */}
          <div className="bg-lift rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] p-6">
            <h3 className="text-base font-medium mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orchid" />
              Ton redactionnel detecte
            </h3>
            <ul className="space-y-2">
              {profile.tone.map((t, i) => (
                <li
                  key={i}
                  className="text-sm text-dark/60 pl-4 border-l-2 border-orchid/20"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Vocabulary */}
          <div className="bg-lift rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] p-6">
            <h3 className="text-base font-medium mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky" />
              Vocabulaire specifique
            </h3>
            <div className="grid md:grid-cols-2 gap-2">
              {profile.vocabulary.map((v, i) => (
                <div
                  key={i}
                  className="text-sm text-dark/60 bg-sky/5 rounded-lg px-4 py-2.5 font-mono"
                >
                  {v}
                </div>
              ))}
            </div>
          </div>

          {/* Structure */}
          <div className="bg-lift rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] p-6">
            <h3 className="text-base font-medium mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-mint" />
              Structure type des articles
            </h3>
            <ol className="space-y-2">
              {profile.structure.map((s, i) => (
                <li key={i} className="text-sm text-dark/60 flex gap-3">
                  <span className="text-dark/20 font-mono text-xs mt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
          </div>

          {/* Insights */}
          <div className="bg-lift rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] p-6">
            <h3 className="text-base font-medium mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-coral" />
              Analyse et lacunes detectees
            </h3>
            <div className="space-y-3">
              {profile.insights.map((insight, i) => (
                <div
                  key={i}
                  className="text-sm text-dark/60 bg-coral/5 rounded-lg px-4 py-3 border-l-2 border-coral/30"
                >
                  {insight}
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="bg-lift rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] p-6">
            <h3 className="text-base font-medium mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sand" />
              Categories existantes
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.categories.map((cat) => (
                <span
                  key={cat}
                  className="text-sm font-medium bg-sand/50 text-dark/60 px-3 py-1.5 rounded-lg"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

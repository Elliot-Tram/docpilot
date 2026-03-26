"use client";

import { useState, useCallback, useRef, useEffect } from "react";

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
    "Tutoiement systematique, ton direct et oriente action",
    "Style convivial et professionnel, sans familiarite excessive",
    "Formulations courtes et synthetiques (max 2 lignes par description)",
    "Vocabulaire technique assume mais toujours accompagne d'une explication simple",
  ],
  vocabulary: [
    "\"Receptionniste IA\" (pas \"assistant vocal\" ou \"bot\")",
    "\"SVI\" / \"Serveur Vocal Interactif\" (pas \"menu telephonique\")",
    "\"Portabilite\" (pas \"transfert de numero\")",
    "\"Synchronisation bidirectionnelle\" (pas \"sync\")",
    "\"Automatisations\" (pas \"workflows\" ou \"regles\")",
    "\"Horaires d'ouverture\" (pas \"disponibilites\")",
  ],
  structure: [
    "Titre thematique court (pas de forme interrogative)",
    "Organisation en cartes cliquables avec icones par section",
    "Structure d'index : titre + description synthetique + lien",
    "Sous-sections regroupees par persona (admin, developpeur, utilisateur)",
    "Lien vers le support et la FAQ accessible depuis chaque section",
  ],
  insights: [
    "Focus fort sur l'onboarding et la configuration technique initiale",
    "Section developpeurs bien fournie (API, webhooks, authentification)",
    "Manque de tutoriels video et d'exemples de code detailles",
    "Pas de guide de bonnes pratiques ni de cas d'usage par secteur",
    "Peu de contenu de troubleshooting avance visible",
    "Structure tres navigationnelle, articles peu approfondis",
  ],
  articlesScanned: 34,
  categories: [
    "Premiers pas",
    "Numeros de telephone",
    "Receptionniste IA",
    "Integrations (HubSpot, Salesforce, Zapier)",
    "Pour les developpeurs",
    "Compte et facturation",
    "Fonctionnalites",
  ],
};

const scanSteps = [
  "Connexion au help center...",
  "Scan des articles publies (34 trouves)...",
  "Extraction du vocabulaire...",
  "Detection du ton redactionnel...",
  "Identification des lacunes...",
  "Profil redactionnel genere !",
];

const stepDelays = [800, 1200, 1000, 1200, 1000, 0];

export default function KnowledgePage() {
  const [url, setUrl] = useState("https://help.withallo.com/fr/get-started");
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [profile, setProfile] = useState<BrandProfile | null>(null);
  const [demoStep, setDemoStep] = useState<"welcome" | "scan" | "done">("scan");
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeSection, setActiveSection] = useState(-1);

  // Auto-scroll through results then navigate to competitors
  useEffect(() => {
    if (!profile || activeSection < 0) return;
    if (activeSection >= sectionRefs.current.length) {
      // Done scrolling, go to competitors
      const timer = setTimeout(() => {
        window.location.href = "/dashboard/competitors";
      }, 1500);
      return () => clearTimeout(timer);
    }
    const el = sectionRefs.current[activeSection];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    const timer = setTimeout(() => {
      setActiveSection((s) => s + 1);
    }, 2000);
    return () => clearTimeout(timer);
  }, [profile, activeSection]);

  const runScan = useCallback(() => {
    setScanning(true);
    setScanStep(0);
    setProfile(null);

    let step = 0;
    function nextStep() {
      if (step >= scanSteps.length - 1) {
        setTimeout(() => {
          setScanning(false);
          setProfile(mockProfile);
          // Start auto-scroll after a short pause
          setTimeout(() => setActiveSection(0), 800);
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
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    setDemoStep("done");
    runScan();
  }

  return (
    <div className="relative">
      {/* Welcome modal */}
      {demoStep === "welcome" && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8">
            <div className="w-12 h-12 rounded-xl bg-orchid/15 flex items-center justify-center mb-5">
              <span className="text-xl font-semibold text-accent-purple">dp</span>
            </div>
            <h2 className="text-xl font-semibold mb-3">
              Bienvenue sur Docpilot
            </h2>
            <p className="text-dark/60 leading-relaxed mb-3">
              Docpilot genere automatiquement des articles pour votre help center
              a partir de vos tickets support.
            </p>
            <p className="text-dark/60 leading-relaxed mb-6">
              Mais avant, il faut qu&apos;on apprenne a vous connaitre.
              Votre help center existant contient votre ton, votre vocabulaire et
              votre facon de structurer vos articles.
            </p>
            <button
              onClick={() => setDemoStep("scan")}
              className="w-full bg-dark text-light py-3 rounded-xl text-sm font-medium hover:bg-accent-purple transition-colors duration-300"
            >
              Commencer
            </button>
          </div>
        </div>
      )}

      {/* Scan prompt overlay */}
      {demoStep === "scan" && !scanning && !profile && (
        <div className="fixed inset-0 bg-black/50 z-40" />
      )}

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
      <div className={`bg-lift rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] p-6 mb-6 transition-all duration-300 ${
        demoStep === "scan" && !scanning && !profile ? "relative z-50 ring-2 ring-orchid shadow-[0_0_40px_rgba(168,85,247,0.25)]" : ""
      }`}>
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
          <div ref={(el) => { sectionRefs.current[0] = el; }} className={`grid grid-cols-3 gap-4 transition-all duration-500 ${activeSection === 0 ? "ring-2 ring-orchid/30 rounded-2xl" : ""}`}>
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
          <div ref={(el) => { sectionRefs.current[1] = el; }} className={`bg-lift rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] p-6 transition-all duration-500 ${activeSection === 1 ? "ring-2 ring-orchid/30" : ""}`}>
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
          <div ref={(el) => { sectionRefs.current[2] = el; }} className={`bg-lift rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] p-6 transition-all duration-500 ${activeSection === 2 ? "ring-2 ring-orchid/30" : ""}`}>
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
          <div ref={(el) => { sectionRefs.current[3] = el; }} className={`bg-lift rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] p-6 transition-all duration-500 ${activeSection === 3 ? "ring-2 ring-orchid/30" : ""}`}>
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
          <div ref={(el) => { sectionRefs.current[4] = el; }} className={`bg-lift rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] p-6 transition-all duration-500 ${activeSection === 4 ? "ring-2 ring-orchid/30" : ""}`}>
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
          <div ref={(el) => { sectionRefs.current[5] = el; }} className={`bg-lift rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] p-6 transition-all duration-500 ${activeSection === 5 ? "ring-2 ring-orchid/30" : ""}`}>
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

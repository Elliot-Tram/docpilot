"use client";

import { useState } from "react";
import Image from "next/image";

/* ─────────────────────── Icons (outline, 1.5px stroke) ─────────────────────── */

function IconTicketToArticle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="6" width="14" height="10" rx="2" />
      <path d="M7 10h6M7 13h4" />
      <path d="M14 16l6 4" />
      <rect x="17" y="16" width="12" height="14" rx="2" />
      <path d="M21 21h4M21 24h6M21 27h3" />
    </svg>
  );
}

function IconRadar({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="16" r="12" />
      <circle cx="16" cy="16" r="7" />
      <circle cx="16" cy="16" r="2" />
      <path d="M16 4v4M16 24v4M4 16h4M24 16h4" />
    </svg>
  );
}

function IconSlackBot({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="8" width="20" height="16" rx="3" />
      <circle cx="12" cy="16" r="1.5" />
      <circle cx="20" cy="16" r="1.5" />
      <path d="M13 20h6" />
      <path d="M12 8V5M20 8V5" />
    </svg>
  );
}

function IconShield({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 3L4 8v8c0 7.2 5.1 13.2 12 15 6.9-1.8 12-7.8 12-15V8L16 3z" />
      <path d="M11 16l3 3 7-7" />
    </svg>
  );
}

function IconArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10h12M12 6l4 4-4 4" />
    </svg>
  );
}

function IconCheck({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 10l4 4 6-7" />
    </svg>
  );
}

/* ─────────────────────── Data ─────────────────────── */

const features = [
  {
    icon: IconTicketToArticle,
    color: "bg-orchid/30 text-accent-purple",
    label: "Fini les tickets répétitifs",
    title: "Vos tickets deviennent des articles",
    description:
      "Docpilot analyse vos tickets Zendesk, Intercom ou Freshdesk, détecte les questions récurrentes et génère des articles prêts à publier. Vos clients trouvent la réponse eux-mêmes — le ticket n'arrive jamais.",
  },
  {
    icon: IconRadar,
    color: "bg-sky/30 text-accent-purple",
    label: "Toujours à jour",
    title: "Votre doc suit le rythme de votre produit",
    description:
      "À chaque nouvelle feature, bug récurrent ou changement produit, Docpilot détecte le gap et propose un brouillon. Votre help center n'est plus jamais en retard.",
  },
  {
    icon: IconSlackBot,
    color: "bg-mint/30 text-accent-purple",
    label: "Zéro effort pour votre équipe",
    title: "Relisez, approuvez, c'est en ligne",
    description:
      "Docpilot collecte l'info technique auprès de vos ingénieurs via Slack, rédige le brouillon et vous le soumet. Vous validez en un clic — pas besoin d'écrire une ligne.",
  },
];

const steps = [
  {
    num: "01",
    title: "Connectez vos sources",
    description: "Zendesk, Intercom, Freshdesk — en 2 minutes.",
  },
  {
    num: "02",
    title: "L'IA analyse vos tickets",
    description: "Détection des questions récurrentes et des lacunes documentaires.",
  },
  {
    num: "03",
    title: "Validez et publiez",
    description: "Relisez les brouillons, approuvez, et publiez en un clic sur votre help center.",
  },
];

const stats = [
  { value: "81%", label: "des clients consultent la KB avant de contacter le support" },
  { value: "40%", label: "des tickets support portent sur des questions déjà documentables" },
  { value: "< 5 min", label: "pour générer un article complet depuis vos tickets" },
  { value: "78%", label: "des clients ne reviennent pas après un mauvais service" },
];

/* ─────────────────────── Waitlist Form ─────────────────────── */

function WaitlistForm({ variant = "light" }: { variant?: "light" | "dark" }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur");
      }
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  const inputBg = variant === "dark" ? "bg-white/10 border-white/10 text-light placeholder:text-light/30 focus:ring-orchid" : "bg-depth border-dark/10 text-dark placeholder:text-dark/30 focus:ring-orchid";
  const successColor = variant === "dark" ? "text-orchid" : "text-accent-purple";

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
      >
        {!submitted ? (
          <>
            <input
              type="email"
              required
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full sm:flex-1 px-5 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all ${inputBg}`}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-dark text-light px-6 py-3 rounded-lg font-medium hover:bg-accent-purple transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "..." : "Rejoindre"}
              {!loading && <IconArrowRight className="w-4 h-4" />}
            </button>
          </>
        ) : (
          <div className={`flex items-center gap-2 font-medium ${successColor}`}>
            <IconCheck className="w-5 h-5" />
            Merci ! Vous serez parmi les premiers informés.
          </div>
        )}
      </form>
      {error && <p className="mt-3 text-coral text-sm">{error}</p>}
    </>
  );
}

/* ─────────────────────── Page ─────────────────────── */

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* ───── Nav ───── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-light/80 backdrop-blur-md border-b border-dark/5">
        <div className="max-w-[1440px] mx-auto px-8 h-16 flex items-center justify-between">
          <span className="text-xl font-semibold tracking-tight">
            doc<span className="text-accent-purple">pilot</span>
          </span>
          <a
            href="#waitlist"
            className="bg-dark text-light px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-accent-purple transition-colors duration-300"
          >
            Rejoindre la waitlist
          </a>
        </div>
      </nav>

      {/* ───── Hero ───── */}
      <section className="pt-40 pb-24 px-8">
        <div className="max-w-[912px] mx-auto text-center">
          <div className="inline-block mb-6">
            <span className="font-mono text-sm bg-orchid/20 text-accent-purple px-4 py-1.5 rounded-full">
              Bientôt disponible — 100% français, hébergé en Europe 🇪🇺
            </span>
          </div>
          <h1 className="text-5xl md:text-[64px] font-normal leading-[1.08] tracking-[-2px] mb-6">
            Vous fermez un ticket.
            <br />
            <span className="text-accent-purple">Un article apparaît.</span>
          </h1>
          <p className="text-lg md:text-xl text-dark/60 max-w-[640px] mx-auto font-light leading-relaxed mb-10">
            Docpilot utilise l&apos;IA pour analyser vos tickets support,
            détecter les questions récurrentes et rédiger automatiquement
            les articles qui manquent dans votre help center.
            Vous n&apos;avez plus qu&apos;à approuver.
          </p>
          <WaitlistForm />
          <div className="flex items-center justify-center gap-6 mt-8">
            <span className="text-xs text-dark/30 font-medium">Se connecte à</span>
            {[
              { name: "Zendesk", domain: "zendesk.com" },
              { name: "Intercom", domain: "intercom.com" },
              { name: "Freshdesk", domain: "freshdesk.com" },
            ].map((tool) => (
              <div key={tool.name} className="flex items-center gap-2 border border-dark/8 px-3 py-1.5 rounded-lg">
                <Image
                  src={`https://cdn.brandfetch.io/${tool.domain}?c=1idYXkEn8JPR8HmylTb`}
                  alt={tool.name}
                  width={20}
                  height={20}
                  className="rounded-sm"
                />
                <span className="text-sm font-medium text-dark/40">{tool.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Social Proof Stats ───── */}
      <section className="py-20 px-8 bg-dark text-light">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.value} className="text-center">
                <p className="text-4xl md:text-5xl font-semibold tracking-tight text-orchid mb-2">
                  {s.value}
                </p>
                <p className="text-sm text-light/60 font-light leading-snug">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Features (3 piliers) ───── */}
      <section className="py-28 px-8" id="features">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <span className="font-mono text-sm text-accent-purple bg-orchid/15 px-4 py-1.5 rounded-full">
              Fonctionnalités
            </span>
            <h2 className="text-4xl md:text-[48px] font-normal tracking-[-1.5px] mt-6 mb-4">
              Un help center qui travaille pour vous
            </h2>
            <p className="text-dark/50 text-lg font-light max-w-[560px] mx-auto">
              Pendant que votre équipe gère les cas complexes, Docpilot
              s&apos;occupe de maintenir votre documentation à jour. Moins de
              tickets, plus de clients satisfaits.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.label}
                className="bg-lift rounded-[20px] p-8 shadow-[0_4px_80px_rgba(0,0,0,0.04)] hover:scale-[1.025] transition-transform duration-300"
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${f.color} flex items-center justify-center mb-6`}
                >
                  <f.icon className="w-7 h-7" />
                </div>
                <span className="font-mono text-xs uppercase tracking-wider text-dark/40 mb-2 block">
                  {f.label}
                </span>
                <h3 className="text-xl font-medium tracking-[-0.5px] mb-3">
                  {f.title}
                </h3>
                <p className="text-dark/55 font-light leading-relaxed text-[15px]">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Comment ça marche ───── */}
      <section className="py-28 px-8 bg-dark text-light">
        <div className="max-w-[912px] mx-auto">
          <div className="text-center mb-16">
            <span className="font-mono text-sm text-orchid bg-orchid/10 px-4 py-1.5 rounded-full">
              Comment ça marche
            </span>
            <h2 className="text-4xl md:text-[48px] font-normal tracking-[-1.5px] mt-6">
              Trois étapes. Zéro effort.
            </h2>
          </div>
          <div className="space-y-12">
            {steps.map((s) => (
              <div key={s.num} className="flex items-start gap-8">
                <span className="font-mono text-4xl font-medium text-orchid/40 shrink-0 w-16">
                  {s.num}
                </span>
                <div>
                  <h3 className="text-2xl font-medium tracking-[-0.5px] mb-2">
                    {s.title}
                  </h3>
                  <p className="text-light/50 font-light text-lg">
                    {s.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Intégrations ───── */}
      <section className="py-28 px-8">
        <div className="max-w-[912px] mx-auto text-center">
          <span className="font-mono text-sm text-accent-purple bg-sky/30 px-4 py-1.5 rounded-full">
            Intégrations
          </span>
          <h2 className="text-4xl md:text-[48px] font-normal tracking-[-1.5px] mt-6 mb-4">
            Se connecte à vos outils
          </h2>
          <p className="text-dark/50 text-lg font-light max-w-[560px] mx-auto mb-12">
            Import des tickets, publication sur votre KB, notifications dans
            Slack — Docpilot s&apos;intègre là où vous travaillez déjà.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {[
              "Zendesk",
              "Intercom",
              "Freshdesk",
              "Notion",
              "GitBook",
              "Slack",
              "Teams",
              "Confluence",
            ].map((tool) => (
              <span
                key={tool}
                className="bg-lift border border-dark/8 rounded-xl px-6 py-3 text-sm font-medium shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-orchid/40 transition-colors duration-300"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ───── RGPD / EU ───── */}
      <section className="py-28 px-8 bg-dark text-light">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="font-mono text-sm text-mint bg-mint/10 px-4 py-1.5 rounded-full">
                Sécurité &amp; Conformité
              </span>
              <h2 className="text-4xl md:text-[48px] font-normal tracking-[-1.5px] mt-6 mb-6">
                Vos données restent en Europe.
              </h2>
              <p className="text-light/50 text-lg font-light leading-relaxed mb-8">
                Docpilot est hébergé en Union Européenne avec un engagement RGPD
                natif. Contrairement aux alternatives américaines, vos données
                support ne traversent jamais l&apos;Atlantique.
              </p>
              <a
                href="#waitlist"
                className="inline-flex items-center gap-2 bg-light text-dark px-6 py-3 rounded-lg font-medium hover:bg-orchid transition-colors duration-300"
              >
                Rejoindre la waitlist
                <IconArrowRight className="w-4 h-4" />
              </a>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  icon: IconShield,
                  title: "RGPD natif",
                  desc: "Conforme dès le premier jour, pas un patch après coup.",
                  bg: "bg-mint/10",
                },
                {
                  icon: IconShield,
                  title: "Hébergement EU",
                  desc: "Serveurs en France et en Allemagne. Zéro transfert hors EU.",
                  bg: "bg-sky/10",
                },
                {
                  icon: IconShield,
                  title: "Chiffrement E2E",
                  desc: "Données chiffrées au repos et en transit. Toujours.",
                  bg: "bg-orchid/10",
                },
                {
                  icon: IconShield,
                  title: "SOC 2 (roadmap)",
                  desc: "Certification SOC 2 Type II prévue pour 2027.",
                  bg: "bg-peach/10",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className={`${item.bg} rounded-2xl p-6`}
                >
                  <item.icon className="w-8 h-8 text-light/70 mb-3" />
                  <h4 className="font-medium mb-1">{item.title}</h4>
                  <p className="text-sm text-light/50 font-light leading-snug">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───── CTA / Waitlist ───── */}
      <section className="py-28 px-8" id="waitlist">
        <div className="max-w-[640px] mx-auto text-center">
          <h2 className="text-4xl md:text-[48px] font-normal tracking-[-1.5px] mb-4">
            Arrêtez de courir après votre documentation.
          </h2>
          <p className="text-dark/50 text-lg font-light mb-10">
            Rejoignez la waitlist et soyez parmi les premiers à tester le
            help center autonome. Accès anticipé gratuit.
          </p>
          <WaitlistForm />
        </div>
      </section>

      {/* ───── Footer ───── */}
      <footer className="py-12 px-8 border-t border-dark/8">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-lg font-semibold tracking-tight">
            doc<span className="text-accent-purple">pilot</span>
          </span>
          <p className="text-sm text-dark/40 font-light">
            © 2026 Docpilot. Conçu en France, hébergé en Europe.
          </p>
        </div>
      </footer>
    </div>
  );
}

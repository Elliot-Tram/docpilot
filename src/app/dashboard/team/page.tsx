"use client";

const experts = [
  {
    name: "Thomas M.",
    role: "Ingenieur VoIP",
    avatar: "TM",
    color: "bg-sky/20 text-sky",
    slackHandle: "@thomas.music",
    topics: ["Telephonie", "SVI", "Transfert d'appel", "Qualite audio"],
    articlesAssigned: 3,
    articlesCompleted: 1,
    status: "available" as const,
  },
  {
    name: "Camille D.",
    role: "Lead Integrations",
    avatar: "CD",
    color: "bg-orchid/20 text-accent-purple",
    slackHandle: "@camille.integ",
    topics: ["HubSpot", "Salesforce", "API", "Webhooks", "Zapier"],
    articlesAssigned: 2,
    articlesCompleted: 0,
    status: "available" as const,
  },
  {
    name: "Alex R.",
    role: "Ingenieur Infrastructure",
    avatar: "AR",
    color: "bg-mint/20 text-dark/80",
    slackHandle: "@alex.infra",
    topics: ["Reseau", "Audio", "Performance", "Securite", "RGPD"],
    articlesAssigned: 2,
    articlesCompleted: 0,
    status: "busy" as const,
  },
  {
    name: "Marie L.",
    role: "Product Manager Telephonie",
    avatar: "ML",
    color: "bg-sand text-dark/80",
    slackHandle: "@marie.pm",
    topics: ["Receptionniste IA", "SVI", "Numeros", "Portabilite", "App mobile"],
    articlesAssigned: 2,
    articlesCompleted: 2,
    status: "available" as const,
  },
  {
    name: "Hugo B.",
    role: "Responsable Facturation",
    avatar: "HB",
    color: "bg-coral/20 text-coral",
    slackHandle: "@hugo.billing",
    topics: ["Facturation", "Forfaits", "Paiement", "SEPA"],
    articlesAssigned: 1,
    articlesCompleted: 0,
    status: "available" as const,
  },
];

const recentMessages = [
  {
    from: "Docpilot",
    to: "Thomas M.",
    channel: "#support-produit",
    message: "Nouvel article suggere : \"Configurer le transfert d'appel vers un mobile\" (63 tickets ce mois). Draft genere. @thomas.music peux-tu valider la partie technique sur les transferts vers numeros courts ?",
    time: "Il y a 2h",
    status: "responded" as const,
  },
  {
    from: "Docpilot",
    to: "Alex R.",
    channel: "#support-produit",
    message: "Nouvel article suggere : \"Resoudre les problemes de qualite audio\" (51 tickets). @alex.infra peux-tu confirmer les ports UDP et les recommandations QoS ?",
    time: "Il y a 5h",
    status: "waiting" as const,
  },
  {
    from: "Docpilot",
    to: "Camille D.",
    channel: "#support-produit",
    message: "Article \"Connecter Allo a HubSpot CRM\" mis a jour avec ta correction sur le mapping custom. Peux-tu valider la nouvelle version ?",
    time: "Il y a 1j",
    status: "responded" as const,
  },
  {
    from: "Docpilot",
    to: "Hugo B.",
    channel: "#support-produit",
    message: "Nouvel article suggere : \"Comprendre sa facture et changer de forfait\" (27 tickets). @hugo.billing peux-tu verifier les infos sur le prelevement SEPA et le changement de forfait au prorata ?",
    time: "Il y a 1j",
    status: "waiting" as const,
  },
];

const statusLabel = {
  available: "Disponible",
  busy: "Occupe",
};

const statusColor = {
  available: "bg-mint text-dark/80",
  busy: "bg-sand text-dark/80",
};

const messageStatusConfig = {
  responded: { label: "Repondu", color: "bg-mint/20 text-dark/80" },
  waiting: { label: "En attente", color: "bg-sand text-dark/80" },
};

export default function TeamPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-medium tracking-[-0.5px]">
          Equipe & Collaboration
        </h1>
        <p className="text-dark/75 mt-1">
          Experts internes et attribution automatique des sujets via Slack
        </p>
      </div>

      {/* How it works */}
      <div className="bg-orchid/5 border border-orchid/15 rounded-2xl p-6 mb-8">
        <h2 className="text-sm font-semibold text-accent-purple mb-3">Comment ca marche</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="flex gap-3">
            <span className="w-7 h-7 rounded-lg bg-orchid/15 flex items-center justify-center text-xs font-bold text-accent-purple shrink-0">1</span>
            <p className="text-sm text-dark/80">Chaque expert est associe a des <strong>sujets de reference</strong> dans Docpilot</p>
          </div>
          <div className="flex gap-3">
            <span className="w-7 h-7 rounded-lg bg-orchid/15 flex items-center justify-center text-xs font-bold text-accent-purple shrink-0">2</span>
            <p className="text-sm text-dark/80">Quand un article est genere, Docpilot identifie le <strong>bon expert</strong> selon le sujet</p>
          </div>
          <div className="flex gap-3">
            <span className="w-7 h-7 rounded-lg bg-orchid/15 flex items-center justify-center text-xs font-bold text-accent-purple shrink-0">3</span>
            <p className="text-sm text-dark/80">L&apos;expert recoit un <strong>message Slack</strong> avec le draft et une question precise</p>
          </div>
          <div className="flex gap-3">
            <span className="w-7 h-7 rounded-lg bg-orchid/15 flex items-center justify-center text-xs font-bold text-accent-purple shrink-0">4</span>
            <p className="text-sm text-dark/80">Sa reponse est <strong>integree par l&apos;IA</strong> dans l&apos;article, pret a valider</p>
          </div>
        </div>
      </div>

      {/* Experts grid */}
      <h2 className="text-lg font-medium mb-4">Experts internes</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {experts.map((expert) => (
          <div
            key={expert.name}
            className="bg-lift rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] p-5"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className={`w-10 h-10 rounded-xl ${expert.color} flex items-center justify-center text-sm font-bold`}>
                {expert.avatar}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold">{expert.name}</h3>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColor[expert.status]}`}>
                    {statusLabel[expert.status]}
                  </span>
                </div>
                <p className="text-xs text-dark/70">{expert.role}</p>
              </div>
            </div>
            <div className="mb-3">
              <p className="text-xs font-medium text-dark/70 mb-1.5">Sujets de reference</p>
              <div className="flex flex-wrap gap-1">
                {expert.topics.map((topic) => (
                  <span key={topic} className="text-[10px] bg-dark/5 text-dark/80 px-2 py-0.5 rounded-md">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between text-xs pt-3 border-t border-dark/5">
              <span className="text-dark/70">Slack : <span className="font-mono">{expert.slackHandle}</span></span>
              <span className="text-dark/80 font-medium">{expert.articlesCompleted}/{expert.articlesAssigned} articles</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Slack messages */}
      <h2 className="text-lg font-medium mb-4">Messages Slack recents</h2>
      <div className="space-y-3">
        {recentMessages.map((msg, i) => (
          <div
            key={i}
            className="bg-lift rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
                  <path d="M7.5 2a2 2 0 00-2 2v1H4a2 2 0 100 4h1.5v3H4a2 2 0 100 4h1.5v1a2 2 0 104 0v-1H12v1a2 2 0 104 0v-1h1.5a2 2 0 100-4H16V9h1.5a2 2 0 100-4H16V4a2 2 0 10-4 0v1H9.5V4a2 2 0 00-2-2zM9.5 9V7H12v2H9.5zm0 2v2H12v-2H9.5z" fill="#E01E5A"/>
                </svg>
                <span className="text-sm font-medium">{msg.channel}</span>
                <span className="text-xs text-dark/65">Docpilot → {msg.to}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${messageStatusConfig[msg.status].color}`}>
                  {messageStatusConfig[msg.status].label}
                </span>
                <span className="text-xs text-dark/65">{msg.time}</span>
              </div>
            </div>
            <p className="text-sm text-dark/80 leading-relaxed">{msg.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

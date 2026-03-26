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
    toAvatar: "TM",
    toColor: "bg-sky/60",
    channel: "#support-produit",
    message: "Nouvel article suggere : \"Configurer le transfert d'appel vers un mobile\" (63 tickets ce mois). Draft genere. @thomas.music peux-tu valider la partie technique sur les transferts vers numeros courts ?",
    time: "14:32",
    status: "responded" as const,
    reply: {
      text: "Le draft est correct. Juste preciser que le transfert ne fonctionne pas vers les numeros courts (3xxx) ni les numeros surtaxes (08xx).",
      time: "14:51",
    },
  },
  {
    from: "Docpilot",
    to: "Alex R.",
    toAvatar: "AR",
    toColor: "bg-mint/60",
    channel: "#support-produit",
    message: "Nouvel article suggere : \"Resoudre les problemes de qualite audio\" (51 tickets). @alex.infra peux-tu confirmer les ports UDP et les recommandations QoS ?",
    time: "11:08",
    status: "waiting" as const,
    reply: null,
  },
  {
    from: "Docpilot",
    to: "Camille D.",
    toAvatar: "CD",
    toColor: "bg-orchid/60",
    channel: "#support-produit",
    message: "Article \"Connecter Allo a HubSpot CRM\" mis a jour avec ta correction sur le mapping custom. Peux-tu valider la nouvelle version ?",
    time: "Hier, 16:45",
    status: "responded" as const,
    reply: {
      text: "C'est bon mais il faut ajouter que le mapping custom des proprietes n'est dispo que sur le plan Pro HubSpot.",
      time: "Hier, 17:12",
    },
  },
  {
    from: "Docpilot",
    to: "Hugo B.",
    toAvatar: "HB",
    toColor: "bg-coral/40",
    channel: "#support-produit",
    message: "Nouvel article suggere : \"Comprendre sa facture et changer de forfait\" (27 tickets). @hugo.billing peux-tu verifier les infos sur le prelevement SEPA et le changement de forfait au prorata ?",
    time: "Hier, 10:22",
    status: "waiting" as const,
    reply: null,
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
      <div className="bg-lift rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] overflow-hidden">
        {/* Channel header */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-dark/8">
          <span className="text-base font-bold text-dark/90">#</span>
          <span className="text-base font-bold text-dark/90">support-produit</span>
          <span className="text-xs text-dark/50 ml-2">Canal pour la collaboration sur les articles</span>
        </div>

        {/* Messages list */}
        <div className="divide-y divide-dark/5">
          {recentMessages.map((msg, i) => (
            <div key={i} className="group">
              {/* Main message from Docpilot */}
              <div className="flex gap-3 px-5 py-4 hover:bg-dark/[0.02] transition-colors">
                {/* Docpilot avatar */}
                <div className="w-9 h-9 rounded-lg bg-accent-purple flex items-center justify-center text-[11px] font-bold text-lift shrink-0 mt-0.5">
                  dp
                </div>
                {/* Message content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[15px] font-bold text-dark/90">Docpilot</span>
                    <span className="text-xs text-dark/50">APP</span>
                    <span className="text-xs text-dark/50 ml-auto shrink-0">{msg.time}</span>
                  </div>
                  <p className="text-[15px] text-dark/85 leading-[1.65] mt-0.5">{msg.message}</p>

                  {/* Thread reply indicator or reply content */}
                  {msg.reply ? (
                    <div className="mt-3 border-l-2 border-orchid/30 pl-3">
                      <div className="flex gap-2.5 py-2 rounded-lg">
                        <div className={`w-7 h-7 rounded-md ${msg.toColor} flex items-center justify-center text-[10px] font-bold text-dark/80 shrink-0`}>
                          {msg.toAvatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2">
                            <span className="text-[13px] font-bold text-dark/90">{msg.to}</span>
                            <span className="text-[11px] text-dark/50">{msg.reply.time}</span>
                          </div>
                          <p className="text-[13px] text-dark/80 leading-[1.6] mt-0.5">{msg.reply.text}</p>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {/* Status badge */}
                  <div className="mt-2.5">
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full ${messageStatusConfig[msg.status].color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${msg.status === "responded" ? "bg-dark/40" : "bg-dark/40"}`} />
                      {messageStatusConfig[msg.status].label}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

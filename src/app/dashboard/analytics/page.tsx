"use client";

export default function AnalyticsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-medium tracking-[-0.5px]">Analytics</h1>
        <p className="text-dark/85 mt-1">
          Temps gagne et impact sur votre equipe
        </p>
      </div>

      {/* Key metrics - time focused */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-lift rounded-2xl p-5 shadow-[0_2px_20px_rgba(0,0,0,0.03)]">
          <p className="text-sm text-dark/80 font-medium mb-1">Temps par article (manuel)</p>
          <p className="text-2xl font-semibold tracking-tight">~3h</p>
          <p className="text-xs text-dark/80 mt-1">recherche + redaction + review</p>
        </div>
        <div className="bg-lift rounded-2xl p-5 shadow-[0_2px_20px_rgba(0,0,0,0.03)]">
          <p className="text-sm text-dark/80 font-medium mb-1">Temps avec Docpilot</p>
          <p className="text-2xl font-semibold tracking-tight text-emerald-600">~15 min</p>
          <p className="text-xs text-dark/80 mt-1">relecture + validation</p>
        </div>
        <div className="bg-lift rounded-2xl p-5 shadow-[0_2px_20px_rgba(0,0,0,0.03)]">
          <p className="text-sm text-dark/80 font-medium mb-1">Gain par article</p>
          <p className="text-2xl font-semibold tracking-tight text-emerald-600">2h45</p>
          <p className="text-xs text-dark/80 mt-1">soit 92% du temps economise</p>
        </div>
        <div className="bg-lift rounded-2xl p-5 shadow-[0_2px_20px_rgba(0,0,0,0.03)]">
          <p className="text-sm text-dark/80 font-medium mb-1">Temps economise (12 articles)</p>
          <p className="text-2xl font-semibold tracking-tight text-emerald-600">33h</p>
          <p className="text-xs text-dark/80 mt-1">~4 jours de travail</p>
        </div>
      </div>

      {/* Time comparison visual */}
      <div className="bg-lift rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] p-6 mb-6">
        <h3 className="text-base font-medium mb-5">Comparaison du temps par article</h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm text-dark/85">Sans Docpilot (manuellement)</span>
              <span className="text-sm font-semibold text-dark/90">~3h00</span>
            </div>
            <div className="w-full h-8 rounded-lg bg-dark/5 overflow-hidden flex">
              <div className="bg-dark/15 h-full flex items-center px-3" style={{ width: "30%" }}>
                <span className="text-[10px] text-dark/80 font-medium">Recherche tickets</span>
              </div>
              <div className="bg-dark/10 h-full flex items-center px-3" style={{ width: "40%" }}>
                <span className="text-[10px] text-dark/80 font-medium">Redaction</span>
              </div>
              <div className="bg-dark/15 h-full flex items-center px-3" style={{ width: "20%" }}>
                <span className="text-[10px] text-dark/80 font-medium">Review</span>
              </div>
              <div className="bg-dark/10 h-full flex items-center px-2" style={{ width: "10%" }}>
                <span className="text-[10px] text-dark/80 font-medium">Publi.</span>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm text-dark/85">Avec Docpilot</span>
              <span className="text-sm font-semibold text-emerald-600">~15 min</span>
            </div>
            <div className="w-full h-8 rounded-lg bg-dark/5 overflow-hidden flex">
              <div className="bg-emerald-200 h-full flex items-center px-3 rounded-lg" style={{ width: "8.3%" }}>
                <span className="text-[10px] text-emerald-800 font-medium whitespace-nowrap">Relire + valider</span>
              </div>
            </div>
            <p className="text-xs text-dark/80 mt-1.5">L&apos;IA fait la recherche, la redaction, la mise en forme et la publication. Vous relisez.</p>
          </div>
        </div>
      </div>

      {/* What the team does vs what Docpilot does */}
      <div className="bg-lift rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] p-6 mb-6">
        <h3 className="text-base font-medium mb-4">Qui fait quoi</h3>
        <div className="overflow-hidden rounded-xl border border-dark/5">
          <table className="w-full">
            <thead>
              <tr className="bg-dark/[0.02]">
                <th className="text-left text-xs font-medium text-dark/80 uppercase tracking-wider px-4 py-2.5">Etape</th>
                <th className="text-center text-xs font-medium text-dark/80 uppercase tracking-wider px-4 py-2.5">Sans Docpilot</th>
                <th className="text-center text-xs font-medium text-dark/80 uppercase tracking-wider px-4 py-2.5">Avec Docpilot</th>
              </tr>
            </thead>
            <tbody>
              {[
                { step: "Detecter les sujets manquants", without: "Agent CS (manuel)", with: "Docpilot (auto)" },
                { step: "Chercher les tickets pertinents", without: "Agent CS (~45 min)", with: "Docpilot (auto)" },
                { step: "Rediger le brouillon", without: "Agent CS (~1h30)", with: "Docpilot (auto)" },
                { step: "Obtenir les infos techniques", without: "Slack / email (~1-3 jours)", with: "Docpilot ping Slack (auto)" },
                { step: "Integrer les corrections", without: "Agent CS (~30 min)", with: "Docpilot (auto)" },
                { step: "Relire et valider", without: "Lead CS (~15 min)", with: "Lead CS (~15 min)" },
                { step: "Publier", without: "Agent CS (~10 min)", with: "1 clic" },
              ].map((row, i) => (
                <tr key={i} className="border-t border-dark/5">
                  <td className="px-4 py-2.5 text-sm text-dark/90 font-medium">{row.step}</td>
                  <td className="px-4 py-2.5 text-center text-sm text-dark/80">{row.without}</td>
                  <td className="px-4 py-2.5 text-center text-sm font-medium text-emerald-600">{row.with}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Articles performance */}
      <div className="bg-lift rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] p-6 mb-6">
        <h3 className="text-base font-medium mb-4">Articles publies</h3>
        <div className="space-y-3">
          {[
            { title: "Configurer la Receptionniste IA", views: 1240, tickets: 482, time: "12 min" },
            { title: "Utiliser l'application mobile Allo", views: 890, tickets: 156, time: "18 min" },
            { title: "Configurer les webhooks et l'API Allo", views: 720, tickets: 140, time: "8 min" },
          ].map((article) => (
            <div key={article.title} className="flex items-center gap-4 p-3 rounded-xl hover:bg-dark/[0.02] transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-dark/90 truncate">{article.title}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-dark/90">{article.views.toLocaleString("fr-FR")} vues</p>
                <p className="text-xs text-dark/80">{article.tickets} tickets evites</p>
              </div>
              <span className="text-xs font-medium text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full shrink-0">
                {article.time} de travail
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Time saved projection */}
      <div className="bg-lift rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="grid lg:grid-cols-2">
          <div className="bg-emerald-50 p-6">
            <h3 className="text-sm font-medium text-dark/85 mb-4">Temps gagne ce mois-ci</h3>
            <p className="text-dark/90 font-semibold mb-2">3 articles publies</p>
            <div className="space-y-1.5 ml-1">
              <p className="text-dark/85 text-sm">
                <span className="text-dark/85 mr-1">&rarr;</span>
                <span className="text-xl font-semibold text-dark/90">8h15</span>{" "}
                <span className="text-dark/80">de redaction economisees</span>
              </p>
              <p className="text-dark/85 text-sm">
                <span className="text-dark/85 mr-1">&rarr;</span>
                <span className="text-xl font-semibold text-dark/90">38 min</span>{" "}
                <span className="text-dark/80">de travail effectif (relecture)</span>
              </p>
            </div>
            <p className="text-xs text-dark/85 mt-4">
              3 articles x 2h45 de gain = 8h15 economisees
            </p>
          </div>
          <div className="bg-orchid/5 p-6">
            <h3 className="text-sm font-medium text-dark/85 mb-4">
              Projection mensuelle (12 articles/mois)
            </h3>
            <div className="space-y-1.5 mb-5">
              <p className="text-dark/90">
                <span className="text-2xl font-semibold">33 heures</span>{" "}
                <span className="text-sm text-dark/80">economisees / mois</span>
              </p>
              <p className="text-dark/90">
                <span className="text-2xl font-semibold">~4 jours</span>{" "}
                <span className="text-sm text-dark/80">de travail / mois</span>
              </p>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs text-dark/85 mb-1.5">
                <span>3 / 12 articles publies</span>
                <span className="font-medium">25%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-dark/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-orchid/40"
                  style={{ width: "25%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

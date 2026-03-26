"use client";

export default function AnalyticsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-medium tracking-[-0.5px]">Analytics</h1>
        <p className="text-dark/85 mt-1">
          Impact de votre help center sur le volume de tickets
        </p>
      </div>

      {/* ROI current vs projection */}
      <div className="bg-lift rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] mb-6 overflow-hidden">
        <div className="grid lg:grid-cols-2">
          <div className="bg-mint/5 p-6">
            <h3 className="text-sm font-medium text-dark/85 mb-4">Impact actuel</h3>
            <p className="text-dark/90 font-semibold mb-2">3 articles publies</p>
            <div className="space-y-1.5 ml-1">
              <p className="text-dark/85 text-sm">
                <span className="text-dark/85 mr-1">&rarr;</span>
                <span className="text-xl font-semibold text-dark/90">~482</span>{" "}
                <span className="text-dark/80">tickets devies / mois</span>
              </p>
              <p className="text-dark/85 text-sm">
                <span className="text-dark/85 mr-1">&rarr;</span>
                <span className="text-xl font-semibold text-dark/90">~7 200 EUR</span>{" "}
                <span className="text-dark/80">/ mois economises</span>
              </p>
            </div>
            <p className="text-xs text-dark/85 mt-4">
              Base sur un cout moyen de 15 EUR par ticket
            </p>
          </div>
          <div className="bg-orchid/5 p-6">
            <h3 className="text-sm font-medium text-dark/85 mb-4">
              Projection si les 12 articles sont publies
            </h3>
            <div className="space-y-1.5 mb-5">
              <p className="text-dark/90">
                <span className="text-2xl font-semibold">~1 930</span>{" "}
                <span className="text-sm text-dark/80">tickets devies / mois</span>
              </p>
              <p className="text-dark/90">
                <span className="text-2xl font-semibold">~28 950 EUR</span>{" "}
                <span className="text-sm text-dark/80">/ mois economises</span>
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

      {/* Key metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-lift rounded-2xl p-5 shadow-[0_2px_20px_rgba(0,0,0,0.03)]">
          <p className="text-sm text-dark/80 font-medium mb-1">Tickets analyses</p>
          <p className="text-2xl font-semibold tracking-tight">4 050</p>
          <p className="text-xs text-dark/80 mt-1">depuis 2 sources</p>
        </div>
        <div className="bg-lift rounded-2xl p-5 shadow-[0_2px_20px_rgba(0,0,0,0.03)]">
          <p className="text-sm text-dark/80 font-medium mb-1">Taux de deflection</p>
          <p className="text-2xl font-semibold tracking-tight">11.9%</p>
          <p className="text-xs text-dark/80 mt-1">482 / 4 050 tickets</p>
        </div>
        <div className="bg-lift rounded-2xl p-5 shadow-[0_2px_20px_rgba(0,0,0,0.03)]">
          <p className="text-sm text-dark/80 font-medium mb-1">Cout / ticket</p>
          <p className="text-2xl font-semibold tracking-tight">15 EUR</p>
          <p className="text-xs text-dark/80 mt-1">moyenne secteur</p>
        </div>
        <div className="bg-lift rounded-2xl p-5 shadow-[0_2px_20px_rgba(0,0,0,0.03)]">
          <p className="text-sm text-dark/80 font-medium mb-1">ROI mensuel</p>
          <p className="text-2xl font-semibold tracking-tight text-emerald-600">x29</p>
          <p className="text-xs text-dark/80 mt-1">7 200 EUR / 249 EUR abo</p>
        </div>
      </div>

      {/* Top deflecting articles */}
      <div className="bg-lift rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] p-6 mb-6">
        <h3 className="text-base font-medium mb-4">Articles les plus performants</h3>
        <div className="space-y-3">
          {[
            { title: "Configurer la Receptionniste IA", views: 1240, deflected: 186, trend: "+12%" },
            { title: "Utiliser l'application mobile Allo", views: 890, deflected: 156, trend: "+8%" },
            { title: "Configurer les webhooks et l'API Allo", views: 720, deflected: 140, trend: "+23%" },
          ].map((article) => (
            <div key={article.title} className="flex items-center gap-4 p-3 rounded-xl hover:bg-dark/[0.02] transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-dark/90 truncate">{article.title}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-dark/90">{article.views.toLocaleString("fr-FR")} vues</p>
                <p className="text-xs text-dark/80">{article.deflected} tickets devies</p>
              </div>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                {article.trend}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly trend */}
      <div className="bg-lift rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] p-6">
        <h3 className="text-base font-medium mb-4">Evolution mensuelle</h3>
        <div className="space-y-3">
          {[
            { month: "Janvier 2026", tickets: 4820, deflected: 0, articles: 0 },
            { month: "Fevrier 2026", tickets: 4650, deflected: 124, articles: 1 },
            { month: "Mars 2026", tickets: 4050, deflected: 482, articles: 3 },
          ].map((m) => (
            <div key={m.month} className="flex items-center gap-4">
              <span className="text-sm text-dark/85 w-32 shrink-0">{m.month}</span>
              <div className="flex-1">
                <div className="flex gap-1 h-6">
                  <div
                    className="bg-dark/10 rounded-l-md"
                    style={{ width: `${((m.tickets - m.deflected) / 5000) * 100}%` }}
                  />
                  {m.deflected > 0 && (
                    <div
                      className="bg-mint rounded-r-md"
                      style={{ width: `${(m.deflected / 5000) * 100}%` }}
                    />
                  )}
                </div>
              </div>
              <div className="text-right shrink-0 w-28">
                <span className="text-sm font-medium text-dark/90">{m.tickets.toLocaleString("fr-FR")}</span>
                {m.deflected > 0 && (
                  <span className="text-xs text-emerald-600 ml-2">-{m.deflected}</span>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-4 text-xs text-dark/80">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-dark/10" />
            Tickets traites
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-mint" />
            Tickets devies par le help center
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";

const steps = [
  {
    number: 1,
    title: "Scannez votre help center",
    description:
      "Docpilot analyse vos articles existants pour comprendre votre ton, votre vocabulaire et votre structure.",
    cta: "Scanner mon help center",
    href: "/dashboard/knowledge",
    prefillKey: "docpilot-kb-url",
    prefillValue: "https://help.withallo.com/fr/get-started",
  },
  {
    number: 2,
    title: "Decouvrez vos suggestions d'articles",
    description:
      "Docpilot a analyse vos tickets et genere des articles prets a publier sur votre help center.",
    cta: "Voir les suggestions",
    href: "/dashboard/suggestions",
  },
  {
    number: 3,
    title: "Analysez un concurrent",
    description:
      "Comparez votre couverture avec celle d'un concurrent et identifiez les opportunites.",
    cta: "Lancer l'analyse concurrentielle",
    href: "/dashboard/competitors",
    prefillKey: "docpilot-competitor-url",
    prefillValue: "https://support.aircall.io",
  },
];

export default function Onboarding({
  onDismiss,
}: {
  onDismiss: () => void;
}) {
  const router = useRouter();

  const storedStep = sessionStorage.getItem("docpilot-onboarding-step");
  const currentStep = storedStep ? Math.min(parseInt(storedStep, 10), steps.length - 1) : 0;

  function handleStepClick(stepIndex: number) {
    const step = steps[stepIndex];

    if (step.prefillKey && step.prefillValue) {
      sessionStorage.setItem(step.prefillKey, step.prefillValue);
    }

    sessionStorage.setItem(
      "docpilot-onboarding-step",
      String(stepIndex + 1)
    );

    if (stepIndex === steps.length - 1) {
      onDismiss();
    }

    router.push(step.href);
  }

  return (
    <div className="bg-lift rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] p-8 mb-8 border border-orchid/15">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-medium">Bienvenue sur Docpilot</h2>
          <p className="text-sm text-dark/40 mt-0.5">
            Decouvrez la plateforme en 3 etapes
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="text-dark/20 hover:text-dark/50 transition-colors text-sm"
        >
          Passer
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {steps.map((step, i) => {
          const isDone = i < currentStep;
          const isActive = i === currentStep;

          return (
            <div
              key={step.number}
              className={`rounded-xl p-5 transition-all duration-300 ${
                isActive
                  ? "bg-dark text-light shadow-lg scale-[1.02]"
                  : isDone
                  ? "bg-mint/10 border border-mint/20"
                  : "bg-dark/[0.02] border border-dark/5"
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                {isDone ? (
                  <div className="w-6 h-6 rounded-full bg-mint flex items-center justify-center">
                    <svg
                      className="w-3.5 h-3.5 text-white"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 10l4 4 6-7" />
                    </svg>
                  </div>
                ) : (
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                      isActive
                        ? "bg-orchid text-white"
                        : "bg-dark/10 text-dark/30"
                    }`}
                  >
                    {step.number}
                  </div>
                )}
                <span
                  className={`text-sm font-medium ${
                    isActive
                      ? "text-light"
                      : isDone
                      ? "text-dark/50"
                      : "text-dark/30"
                  }`}
                >
                  Etape {step.number}
                </span>
              </div>

              <h3
                className={`font-medium mb-1.5 ${
                  isActive
                    ? "text-light"
                    : isDone
                    ? "text-dark/60"
                    : "text-dark/30"
                }`}
              >
                {step.title}
              </h3>

              <p
                className={`text-sm leading-relaxed mb-4 ${
                  isActive
                    ? "text-light/60"
                    : isDone
                    ? "text-dark/40"
                    : "text-dark/20"
                }`}
              >
                {step.description}
              </p>

              {isActive && (
                <button
                  onClick={() => handleStepClick(i)}
                  className="w-full bg-orchid text-white py-2.5 rounded-lg text-sm font-medium hover:bg-orchid/90 transition-colors"
                >
                  {step.cta}
                </button>
              )}

              {isDone && (
                <span className="text-sm text-mint font-medium">
                  Termine
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

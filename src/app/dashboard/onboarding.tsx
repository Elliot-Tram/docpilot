"use client";

import { useRouter } from "next/navigation";

const steps = [
  {
    number: 1,
    title: "Votre tableau de bord",
    description:
      "Vue d'ensemble de votre activite : tickets analyses, articles generes, gaps detectes.",
    cta: "Explorer les suggestions",
    href: "/dashboard/suggestions",
  },
  {
    number: 2,
    title: "Articles generes par l'IA",
    description:
      "Relisez, editez et publiez les articles generes automatiquement depuis vos tickets.",
    cta: "Scanner mon help center",
    href: "/dashboard/knowledge",
    prefillKey: "docpilot-kb-url",
    prefillValue: "https://help.withallo.com/fr/get-started",
  },
  {
    number: 3,
    title: "Votre base de connaissances",
    description:
      "Docpilot scanne votre help center existant pour s'adapter a votre ton et votre vocabulaire.",
    cta: "Analyser un concurrent",
    href: "/dashboard/competitors",
    prefillKey: "docpilot-competitor-url",
    prefillValue: "https://support.aircall.io",
  },
  {
    number: 4,
    title: "Veille concurrentielle",
    description:
      "Comparez votre couverture avec celle d'un concurrent et identifiez vos opportunites.",
    cta: "Voir l'analyse",
    href: "/dashboard/competitors",
    prefillKey: "docpilot-competitor-url",
    prefillValue: "https://support.aircall.io",
    isFinal: true,
  },
];

export default function Onboarding({
  onDismiss,
}: {
  onDismiss: () => void;
}) {
  const router = useRouter();

  const storedStep = sessionStorage.getItem("docpilot-onboarding-step");
  const currentStep = storedStep
    ? Math.min(parseInt(storedStep, 10), steps.length - 1)
    : 0;

  function handleStepClick(stepIndex: number) {
    const step = steps[stepIndex];

    if (step.prefillKey && step.prefillValue) {
      sessionStorage.setItem(step.prefillKey, step.prefillValue);
    }

    sessionStorage.setItem(
      "docpilot-onboarding-step",
      String(stepIndex + 1)
    );

    if ("isFinal" in step && step.isFinal) {
      onDismiss();
    }

    router.push(step.href);
  }

  return (
    <div className="bg-lift rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] p-6 mb-8 border border-orchid/15">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-medium">Bienvenue sur Docpilot</h2>
          <p className="text-sm text-dark/60 mt-0.5">
            Decouvrez la plateforme en {steps.length} etapes
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="text-dark/20 hover:text-dark/50 transition-colors text-sm"
        >
          Passer
        </button>
      </div>

      {/* Progress bar */}
      <div className="flex gap-1.5 mb-5">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full flex-1 transition-all duration-500 ${
              i < currentStep
                ? "bg-mint"
                : i === currentStep
                ? "bg-orchid"
                : "bg-dark/10"
            }`}
          />
        ))}
      </div>

      {/* Current step */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-orchid/15 flex items-center justify-center text-sm font-semibold text-accent-purple">
            {steps[currentStep].number}/{steps.length}
          </div>
          <div>
            <h3 className="font-medium text-sm">
              {steps[currentStep].title}
            </h3>
            <p className="text-sm text-dark/60 mt-0.5">
              {steps[currentStep].description}
            </p>
          </div>
        </div>
        <button
          onClick={() => handleStepClick(currentStep)}
          className="bg-dark text-light px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-accent-purple transition-colors duration-300 whitespace-nowrap shrink-0 ml-6"
        >
          {steps[currentStep].cta}
        </button>
      </div>
    </div>
  );
}

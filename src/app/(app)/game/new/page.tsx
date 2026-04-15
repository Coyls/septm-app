"use client";

import { useGameWizardStore } from "@/stores/game-wizard.store";
import { useEffect } from "react";
import { ConfirmationStep } from "./_components/confirmation-step";
import { ExtensionStep } from "./_components/extension-step";
import { PlayerStep } from "./_components/player-step";
import { WizardStepIndicator } from "./_components/wizard-step-indicator";

export default function NewGamePage() {
  const { step } = useGameWizardStore();

  useEffect(() => {
    useGameWizardStore.persist.rehydrate();
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Nouvelle partie</h1>
      <WizardStepIndicator currentStep={step} />

      {step === 1 && <ExtensionStep />}
      {step === 2 && <PlayerStep />}
      {step === 3 && <ConfirmationStep />}
    </div>
  );
}

"use client"

import { useEffect } from "react"
import { WizardStepIndicator } from "./_components/WizardStepIndicator"
import { ExtensionStep } from "./_components/ExtensionStep"
import { PlayerStep } from "./_components/PlayerStep"
import { ConfirmationStep } from "./_components/ConfirmationStep"
import { useGameWizardStore } from "@/stores/game-wizard.store"

export default function NewGamePage() {
  const { step } = useGameWizardStore()

  // Rehydrate sessionStorage persistence on client mount
  useEffect(() => {
    useGameWizardStore.persist.rehydrate()
  }, [])

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Nouvelle partie</h1>
      <WizardStepIndicator currentStep={step} />

      {step === 1 && <ExtensionStep />}
      {step === 2 && <PlayerStep />}
      {step === 3 && <ConfirmationStep />}
    </div>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ToggleTile } from "@/components/ui/toggle-tile"
import { useGameOptions } from "@/lib/query/hooks/useGameOptions"
import { useGameWizardStore } from "@/stores/game-wizard.store"
import type { ExtensionId } from "@/lib/types"
import { LucideMoveRight } from "lucide-react"

const EXTENSION_IMAGES: Partial<Record<ExtensionId, string>> = {
  VANILLA:       "/extensions/extension-vanilla.png",
  LEADER:        "/extensions/extension-leader.png",
  CITIES:        "/extensions/extension-cities.png",
  ARMADA:        "/extensions/extension-armada.png",
  EDIFICE:       "/extensions/extension-edifice.png",
  GRAND_PROJECT: "/extensions/extension-grand-projet.png",
  BABEL:         "/extensions/extension-babel.png",
  WONDER_PACK:   "/extensions/extension-wonder-pack.png",
}

export function ExtensionStep() {
  const { data: options, isLoading } = useGameOptions()
  const { selectedExtensions, toggleExtension, setStep } = useGameWizardStore()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Choisissez les extensions</h2>
        <p className="text-sm text-muted-foreground">
          Sélectionnez les extensions utilisées dans cette partie.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {options?.extensions.map((ext) => {
            const isVanilla = ext.id === "VANILLA"
            const isChecked =
              isVanilla || selectedExtensions.includes(ext.id as ExtensionId)

            return (
              <ToggleTile
                key={ext.id}
                label={ext.name}
                sublabel={isVanilla ? "toujours inclus" : undefined}
                image={EXTENSION_IMAGES[ext.id as ExtensionId]}
                checked={isChecked}
                disabled={isVanilla}
                onChange={() => toggleExtension(ext.id as ExtensionId)}
              />
            )
          })}
        </div>
      )}

      <div className="flex justify-end pt-4">
        <Button onClick={() => setStep(2)}>Suivant <LucideMoveRight /> </Button>
      </div>
    </div>
  )
}

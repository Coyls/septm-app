"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useGameOptions } from "@/lib/query/hooks/useGameOptions"
import { useGameWizardStore } from "@/stores/game-wizard.store"
import type { ExtensionId } from "@/lib/types"

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
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {options?.extensions.map((ext) => {
            const isVanilla = ext.id === "VANILLA"
            const isChecked =
              isVanilla || selectedExtensions.includes(ext.id as ExtensionId)

            return (
              <div key={ext.id} className="flex items-center gap-3">
                <Checkbox
                  id={ext.id}
                  checked={isChecked}
                  disabled={isVanilla}
                  onCheckedChange={() => toggleExtension(ext.id as ExtensionId)}
                />
                <Label
                  htmlFor={ext.id}
                  className={isVanilla ? "text-muted-foreground" : "cursor-pointer"}
                >
                  {ext.name}
                  {isVanilla && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      (toujours inclus)
                    </span>
                  )}
                </Label>
              </div>
            )
          })}
        </div>
      )}

      <div className="flex justify-end pt-4">
        <Button onClick={() => setStep(2)}>Suivant →</Button>
      </div>
    </div>
  )
}

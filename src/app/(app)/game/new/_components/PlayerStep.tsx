"use client"

import { useState } from "react"
import { Trash2, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { WonderCard } from "@/components/game/WonderCard"
import { FriendCombobox } from "@/components/friends/FriendCombobox"
import { useGameOptions } from "@/lib/query/hooks/useGameOptions"
import { useGameWizardStore } from "@/stores/game-wizard.store"
import type { ExtensionId, Wonder, WonderId, Side } from "@/lib/types"

export function PlayerStep() {
  const { data: options, isLoading } = useGameOptions()
  const {
    players,
    selectedExtensions,
    addPlayer,
    removePlayer,
    updatePlayer,
    setStep,
  } = useGameWizardStore()

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Filter wonders based on selected extensions
  const availableWonders: Wonder[] =
    options?.wonders.filter((w) =>
      selectedExtensions.includes(w.extensionId as ExtensionId),
    ) ?? []

  // Track chosen wonder IDs
  const chosenWonderIds = new Set(players.map((p) => p.wonderId).filter(Boolean))

  function validate() {
    const newErrors: Record<string, string> = {}

    if (players.length < 3) {
      newErrors["_global"] = "Il faut au minimum 3 joueurs."
    }

    players.forEach((p) => {
      if (!p.name.trim()) newErrors[`${p.id}_name`] = "Le nom est requis."
      if (!p.wonderId) newErrors[`${p.id}_wonder`] = "Choisissez une merveille."
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleNext() {
    if (validate()) setStep(3)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Configurez les joueurs</h2>
        <p className="text-sm text-muted-foreground">
          Minimum 3 joueurs. Chaque joueur doit choisir une merveille unique.
        </p>
      </div>

      {errors["_global"] && (
        <p className="text-sm text-destructive">{errors["_global"]}</p>
      )}

      <div className="space-y-4">
        {players.map((player, idx) => (
          <Card key={player.id}>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base">Joueur {idx + 1}</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={() => removePlayer(player.id)}
                disabled={players.length <= 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Name */}
              <div className="space-y-1">
                <Label htmlFor={`name-${player.id}`}>Nom *</Label>
                <Input
                  id={`name-${player.id}`}
                  value={player.name}
                  onChange={(e) => updatePlayer(player.id, { name: e.target.value })}
                  placeholder="Prénom ou pseudo"
                />
                {errors[`${player.id}_name`] && (
                  <p className="text-xs text-destructive">
                    {errors[`${player.id}_name`]}
                  </p>
                )}
              </div>

              {/* Friend association */}
              <div className="space-y-1">
                <Label>Associer à un ami</Label>
                <FriendCombobox
                  value={player.userId ?? null}
                  onChange={(userId, name) => {
                    updatePlayer(player.id, {
                      userId: userId ?? undefined,
                      name: name ?? player.name,
                    })
                  }}
                />
              </div>

              {/* Wonder selection */}
              <div className="space-y-1">
                <Label>Merveille *</Label>
                {errors[`${player.id}_wonder`] && (
                  <p className="text-xs text-destructive">
                    {errors[`${player.id}_wonder`]}
                  </p>
                )}
                <ScrollArea className="h-64 pr-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {availableWonders.map((wonder) => {
                      const isChosen =
                        chosenWonderIds.has(wonder.id as WonderId) &&
                        player.wonderId !== wonder.id
                      return (
                        <WonderCard
                          key={wonder.id}
                          wonder={wonder}
                          selectedSide={player.wonderSide}
                          onSideChange={(side: Side) =>
                            updatePlayer(player.id, { wonderSide: side })
                          }
                          isSelected={player.wonderId === wonder.id}
                          onSelect={() =>
                            updatePlayer(player.id, {
                              wonderId: wonder.id as WonderId,
                            })
                          }
                          isDisabled={isChosen}
                          availableExtensions={
                            selectedExtensions as ExtensionId[]
                          }
                        />
                      )
                    })}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        variant="outline"
        className="w-full gap-2"
        onClick={addPlayer}
      >
        <PlusCircle className="h-4 w-4" />
        Ajouter un joueur
      </Button>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={() => setStep(1)}>
          ← Précédent
        </Button>
        <Button onClick={handleNext}>Suivant →</Button>
      </div>
    </div>
  )
}

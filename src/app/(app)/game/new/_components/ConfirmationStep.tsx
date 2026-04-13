"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useGameWizardStore } from "@/stores/game-wizard.store"
import { useCreateGame } from "@/lib/query/hooks/useGame"
import { useGameOptions } from "@/lib/query/hooks/useGameOptions"
import { useMe } from "@/lib/query/hooks/useAuth"
import { getErrorMessage } from "@/lib/utils"
import { AppError } from "@/lib/types"
import { toast } from "sonner"

export function ConfirmationStep() {
  const { selectedExtensions, players, setStep } = useGameWizardStore()
  const { data: options } = useGameOptions()
  const { data: meData } = useMe()
  const { mutate: createGame, isPending } = useCreateGame()

  function getExtensionName(id: string) {
    return options?.extensions.find((e) => e.id === id)?.name ?? id
  }

  function getWonderName(id: string | null) {
    if (!id) return "—"
    return options?.wonders.find((w) => w.id === id)?.name ?? id
  }

  function handleCreate() {
    createGame(
      {
        extensionIds: selectedExtensions.filter((e) => e !== "VANILLA"),
        players: players.map((p) => ({
          userId: p.userId,
          name: p.name,
          email: p.email,
          wonderId: p.wonderId!,
          wonderSide: p.wonderSide,
        })),
      },
      {
        onError: (err) => {
          const msg =
            err instanceof AppError
              ? getErrorMessage(err.code)
              : "Une erreur est survenue."
          toast.error(msg)
        },
      },
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Récapitulatif</h2>
        <p className="text-sm text-muted-foreground">
          Vérifiez les informations avant de créer la partie.
        </p>
      </div>

      {/* Extensions */}
      <Card>
        <CardContent className="pt-4">
          <p className="text-sm font-medium mb-2">Extensions</p>
          <div className="flex flex-wrap gap-1">
            {selectedExtensions.map((id) => (
              <Badge key={id} variant="secondary">
                {getExtensionName(id)}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Players */}
      <Card>
        <CardContent className="pt-4">
          <p className="text-sm font-medium mb-3">
            Joueurs ({players.length})
          </p>
          <div className="space-y-2">
            {players.map((player, idx) => (
              <div key={player.id}>
                {idx > 0 && <Separator className="mb-2" />}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{player.name || "—"}</p>
                    <p className="text-xs text-muted-foreground">
                      {getWonderName(player.wonderId)} — Face {player.wonderSide}
                    </p>
                  </div>
                  {player.userId && (
                    <Badge variant="outline" className="text-xs">
                      {player.userId === meData?.user?.userId ? "Vous" : "Ami lié"}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={() => setStep(2)} disabled={isPending}>
          ← Précédent
        </Button>
        <Button onClick={handleCreate} disabled={isPending}>
          {isPending ? "Création…" : "Créer la partie"}
        </Button>
      </div>
    </div>
  )
}

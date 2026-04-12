"use client"

import { useState, useEffect } from "react"
import { use } from "react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { PlayerScoreCard, type PlayerScoreState } from "@/components/game/PlayerScoreCard"
import { LiveLeaderboard } from "@/components/game/LiveLeaderboard"
import { useGameWizardStore } from "@/stores/game-wizard.store"
import { useSubmitScore } from "@/lib/query/hooks/useGame"
import { useGameOptions } from "@/lib/query/hooks/useGameOptions"
import { EXTENSION_POINT_TYPES, POINT_TYPE_META } from "@/lib/types"
import type { PointTypeId, ExtensionId } from "@/lib/types"
import { getErrorMessage } from "@/lib/utils"
import { AppError } from "@/lib/types"
import { toast } from "sonner"

export default function ScorePage({
  params,
}: {
  params: Promise<{ gameId: string }>
}) {
  const { gameId } = use(params)
  const { players, selectedExtensions } = useGameWizardStore()
  const { data: options } = useGameOptions()
  const { mutate: submitScore, isPending } = useSubmitScore(gameId)

  // Compute allowed point types from extensions
  const allowedPointTypeIds = new Set<PointTypeId>(
    (selectedExtensions as ExtensionId[]).flatMap(
      (ext) => EXTENSION_POINT_TYPES[ext] ?? [],
    ),
  )
  const allowedPointTypes = Object.values(POINT_TYPE_META).filter((pt) =>
    allowedPointTypeIds.has(pt.id),
  )

  // Get wonder names from options
  function getWonderName(wonderId: string) {
    return options?.wonders.find((w) => w.id === wonderId)?.name ?? wonderId
  }

  // Initialize scores from wizard store
  const [scores, setScores] = useState<PlayerScoreState[]>([])

  useEffect(() => {
    useGameWizardStore.persist.rehydrate()
  }, [])

  useEffect(() => {
    if (players.length > 0 && scores.length === 0) {
      setScores(
        players.map((p) => ({
          playerId: p.id, // using local wizard id; backend player id may differ
          playerName: p.name,
          wonderId: p.wonderId ?? "",
          wonderName: getWonderName(p.wonderId ?? ""),
          wonderSide: p.wonderSide,
          coins: 0,
          points: Object.fromEntries(
            allowedPointTypes
              .filter((pt) => pt.id !== "COIN")
              .map((pt) => [pt.id, 0]),
          ) as Record<PointTypeId, number>,
        })),
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players, options])

  function handleChange(playerId: string, field: "coins" | PointTypeId, value: number) {
    setScores((prev) =>
      prev.map((p) => {
        if (p.playerId !== playerId) return p
        if (field === "coins") return { ...p, coins: value }
        return { ...p, points: { ...p.points, [field]: value } }
      }),
    )
  }

  const allCoinsEntered = scores.every((s) => s.coins >= 0)

  function handleSubmit() {
    submitScore(
      {
        players: scores.map((s) => ({
          playerId: s.playerId,
          coins: s.coins,
          points: allowedPointTypes
            .filter((pt) => pt.id !== "COIN")
            .map((pt) => ({
              pointTypeId: pt.id,
              points: s.points[pt.id] ?? 0,
            })),
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
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Saisie des scores</h1>
          <p className="text-sm text-muted-foreground">Partie #{gameId.slice(0, 8)}…</p>
        </div>

        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button disabled={!allCoinsEntered || isPending || scores.length === 0} />
            }
          >
            {isPending ? "Enregistrement…" : "Finaliser la partie"}
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Finaliser la partie ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. Les scores seront enregistrés
                définitivement.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleSubmit}>
                Confirmer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score cards — 2/3 width */}
        <div className="lg:col-span-2 space-y-4">
          {scores.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Aucun joueur trouvé. Revenez à la création de partie.
            </p>
          ) : (
            scores.map((player) => (
              <PlayerScoreCard
                key={player.playerId}
                player={player}
                allowedPointTypes={allowedPointTypes}
                onChange={handleChange}
              />
            ))
          )}
        </div>

        {/* Leaderboard — 1/3 width */}
        <div>
          <LiveLeaderboard players={scores} />
        </div>
      </div>
    </div>
  )
}

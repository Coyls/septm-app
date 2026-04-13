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
import { useGameWizardStore } from "@/stores/game-wizard.store"
import { useSubmitScore } from "@/lib/query/hooks/useGame"
import { useGameOptions } from "@/lib/query/hooks/useGameOptions"
import { EXTENSION_POINT_TYPES, POINT_TYPE_META } from "@/lib/types"
import { calculatePlayerTotal, formatCoinsToPoints, getErrorMessage } from "@/lib/utils"
import { AppError } from "@/lib/types"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import type { PointTypeId, ExtensionId, PointTypeMeta } from "@/lib/types"

export interface PlayerScoreState {
  playerId: string
  playerName: string
  wonderName: string
  wonderSide: string
  coins: number
  points: Record<PointTypeId, number>
}

export default function ScorePage({
  params,
}: {
  params: Promise<{ gameId: string }>
}) {
  const { gameId } = use(params)
  const { players, selectedExtensions } = useGameWizardStore()
  const { data: options } = useGameOptions()
  const { mutate: submitScore, isPending } = useSubmitScore(gameId)

  const allowedPointTypeIds = new Set<PointTypeId>(
    (selectedExtensions as ExtensionId[]).flatMap(
      (ext) => EXTENSION_POINT_TYPES[ext] ?? [],
    ),
  )

  const rows: PointTypeMeta[] = Object.values(POINT_TYPE_META)
    .filter((pt) => allowedPointTypeIds.has(pt.id))
    .sort((a, b) => a.order - b.order)

  // COIN row is always first and handled separately
  const coinRow = rows.find((r) => r.id === "COIN")
  const pointRows = rows.filter((r) => r.id !== "COIN")

  function getWonderName(wonderId: string) {
    return options?.wonders.find((w) => w.id === wonderId)?.name ?? wonderId
  }

  const [scores, setScores] = useState<PlayerScoreState[]>([])

  useEffect(() => {
    useGameWizardStore.persist.rehydrate()
  }, [])

  useEffect(() => {
    if (players.length > 0 && scores.length === 0) {
      setScores(
        players.map((p) => ({
          playerId: p.backendPlayerId ?? p.id,
          playerName: p.name,
          wonderName: getWonderName(p.wonderId ?? ""),
          wonderSide: p.wonderSide,
          coins: 0,
          points: Object.fromEntries(
            pointRows.map((pt) => [pt.id, 0]),
          ) as Record<PointTypeId, number>,
        })),
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players, options])

  function handleChange(playerId: string, field: "coins" | PointTypeId, raw: string) {
    const value = raw === "" ? 0 : parseInt(raw, 10)
    if (isNaN(value)) return
    setScores((prev) =>
      prev.map((p) => {
        if (p.playerId !== playerId) return p
        if (field === "coins") return { ...p, coins: value }
        return { ...p, points: { ...p.points, [field]: value } }
      }),
    )
  }

  const sorted = [...scores].sort(
    (a, b) =>
      calculatePlayerTotal(b.coins, b.points) -
      calculatePlayerTotal(a.coins, a.points),
  )
  const gap =
    sorted.length >= 2
      ? calculatePlayerTotal(sorted[0].coins, sorted[0].points) -
        calculatePlayerTotal(sorted[1].coins, sorted[1].points)
      : 0

  const allCoinsEntered = scores.every((s) => s.coins >= 0)

  function handleSubmit() {
    submitScore(
      {
        players: scores.map((s) => ({
          playerId: s.playerId,
          coins: s.coins,
          points: pointRows.map((pt) => ({
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
    <div className="space-y-4">

      {/* Page header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
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
                Cette action est irréversible. Les scores seront enregistrés définitivement.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleSubmit}>Confirmer</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Live leaderboard bar */}
      {sorted.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto rounded-lg border border-border bg-card px-3 py-2 text-sm">
          <span className="shrink-0 text-xs text-muted-foreground font-medium uppercase tracking-wide pr-2 border-r border-border">
            Classement
          </span>
          {sorted.map((p, idx) => {
            const total = calculatePlayerTotal(p.coins, p.points)
            const medals = ["🥇", "🥈", "🥉"]
            return (
              <div
                key={p.playerId}
                className={cn(
                  "flex items-center gap-1.5 shrink-0 rounded-md px-2 py-1",
                  idx === 0 ? "bg-primary/10 text-foreground" : "text-muted-foreground",
                )}
              >
                <span className="text-xs">{medals[idx] ?? `${idx + 1}.`}</span>
                <span className="text-xs font-medium truncate max-w-[80px]">{p.playerName}</span>
                <span className={cn("text-xs font-bold", idx === 0 ? "text-primary" : "")}>
                  {total}
                </span>
              </div>
            )
          })}
          {sorted.length >= 2 && (
            <span className="shrink-0 ml-auto text-xs text-muted-foreground pl-2 border-l border-border">
              Écart : <strong className="text-foreground">{gap} pts</strong>
            </span>
          )}
        </div>
      )}

      {/* Score table */}
      {scores.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Aucun joueur trouvé. Revenez à la création de partie.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full border-collapse" style={{ minWidth: `${180 + scores.length * 110}px` }}>

            {/* Player headers */}
            <thead>
              <tr className="border-b border-border bg-card">
                {/* Label column header */}
                <th className="sticky left-0 z-20 bg-card w-[140px] min-w-[140px] px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide border-r border-border">
                  Catégorie
                </th>
                {scores.map((p, idx) => {
                  const total = calculatePlayerTotal(p.coins, p.points)
                  const isLeader = sorted[0]?.playerId === p.playerId
                  return (
                    <th
                      key={p.playerId}
                      className={cn(
                        "px-2 py-3 text-center min-w-[110px]",
                        idx < scores.length - 1 && "border-r border-border",
                      )}
                    >
                      <p className={cn(
                        "text-sm font-semibold truncate",
                        isLeader ? "text-primary" : "text-foreground",
                      )}>
                        {p.playerName || `J${idx + 1}`}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {p.wonderName} {p.wonderSide}
                      </p>
                      <p className={cn(
                        "text-sm font-bold mt-0.5",
                        isLeader ? "text-primary" : "text-foreground",
                      )}>
                        {total} pts
                      </p>
                    </th>
                  )
                })}
              </tr>
            </thead>

            <tbody>
              {/* Coins row */}
              {coinRow && (
                <tr className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="sticky left-0 z-10 bg-card px-3 py-3 border-r border-border">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: coinRow.color }}
                      />
                      <span className="text-xs font-medium text-foreground whitespace-nowrap">
                        {coinRow.label}
                      </span>
                    </div>
                  </td>
                  {scores.map((p, idx) => {
                    const pts = formatCoinsToPoints(p.coins)
                    return (
                      <td
                        key={p.playerId}
                        className={cn(
                          "px-2 py-2 text-center",
                          idx < scores.length - 1 && "border-r border-border",
                        )}
                      >
                        <input
                          type="number"
                          inputMode="numeric"
                          min={0}
                          value={p.coins === 0 ? "" : p.coins}
                          onChange={(e) => handleChange(p.playerId, "coins", e.target.value)}
                          placeholder="0"
                          className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-center text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                        />
                        <p className="text-[11px] text-muted-foreground mt-1">
                          = {pts} pt{pts !== 1 ? "s" : ""}
                        </p>
                      </td>
                    )
                  })}
                </tr>
              )}

              {/* Point type rows */}
              {pointRows.map((pt) => (
                <tr
                  key={pt.id}
                  className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                >
                  <td className="sticky left-0 z-10 bg-background px-3 py-3 border-r border-border">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: pt.color }}
                      />
                      <span className="text-xs font-medium text-foreground whitespace-nowrap">
                        {pt.label}
                      </span>
                    </div>
                  </td>
                  {scores.map((p, idx) => (
                    <td
                      key={p.playerId}
                      className={cn(
                        "px-2 py-2 text-center",
                        idx < scores.length - 1 && "border-r border-border",
                      )}
                    >
                      <input
                        type="number"
                        inputMode="numeric"
                        value={p.points[pt.id] === 0 ? "" : p.points[pt.id]}
                        onChange={(e) => handleChange(p.playerId, pt.id, e.target.value)}
                        placeholder="0"
                        className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-center text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                      />
                    </td>
                  ))}
                </tr>
              ))}

              {/* Total row */}
              <tr className="border-t-2 border-border bg-muted/20">
                <td className="sticky left-0 z-10 bg-background px-3 py-3 border-r border-border">
                  <span className="text-xs font-bold uppercase tracking-wide text-foreground">
                    Total
                  </span>
                </td>
                {scores.map((p, idx) => {
                  const total = calculatePlayerTotal(p.coins, p.points)
                  const isLeader = sorted[0]?.playerId === p.playerId
                  return (
                    <td
                      key={p.playerId}
                      className={cn(
                        "px-2 py-3 text-center",
                        idx < scores.length - 1 && "border-r border-border",
                      )}
                    >
                      <span className={cn(
                        "text-sm font-bold",
                        isLeader ? "text-primary" : "text-foreground",
                      )}>
                        {total} pts
                      </span>
                    </td>
                  )
                })}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

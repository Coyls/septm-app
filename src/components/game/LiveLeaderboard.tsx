"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { calculatePlayerTotal } from "@/lib/utils"
import type { PlayerScoreState } from "./PlayerScoreCard"

const MEDALS = ["🥇", "🥈", "🥉"]

interface LiveLeaderboardProps {
  players: PlayerScoreState[]
}

export function LiveLeaderboard({ players }: LiveLeaderboardProps) {
  const sorted = [...players].sort((a, b) => {
    const totalA = calculatePlayerTotal(a.coins, a.points)
    const totalB = calculatePlayerTotal(b.coins, b.points)
    return totalB - totalA
  })

  const topScore = sorted[0]
    ? calculatePlayerTotal(sorted[0].coins, sorted[0].points)
    : 0
  const secondScore = sorted[1]
    ? calculatePlayerTotal(sorted[1].coins, sorted[1].points)
    : 0
  const gap = topScore - secondScore

  return (
    <Card className="sticky top-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Classement en direct</CardTitle>
        {sorted.length >= 2 && (
          <p className="text-xs text-muted-foreground">
            Écart 1er / 2ème :{" "}
            <strong className="text-foreground">{gap} pt{gap !== 1 ? "s" : ""}</strong>
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        {sorted.map((player, idx) => {
          const total = calculatePlayerTotal(player.coins, player.points)
          return (
            <div
              key={player.playerId}
              className="flex items-center justify-between py-1.5 border-b border-border last:border-0"
            >
              <div className="flex items-center gap-2">
                <span className="text-base" aria-hidden>
                  {MEDALS[idx] ?? `${idx + 1}.`}
                </span>
                <span className="text-sm font-medium truncate max-w-[120px]">
                  {player.playerName}
                </span>
              </div>
              <Badge variant={idx === 0 ? "default" : "secondary"}>
                {total} pts
              </Badge>
            </div>
          )
        })}
        {players.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Aucun joueur
          </p>
        )}
      </CardContent>
    </Card>
  )
}

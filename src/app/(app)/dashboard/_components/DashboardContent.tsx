"use client"

import Link from "next/link"
import { useState } from "react"
import { PlusCircle, Users, Trophy, BarChart2, Copy, Check } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { StatCard } from "@/components/statistics/StatCard"
import { useMe } from "@/lib/query/hooks/useAuth"
import { useMyStats } from "@/lib/query/hooks/useStatistics"
import { useReceivedRequests } from "@/lib/query/hooks/useFriends"
import { formatWinRate, formatScore, cn } from "@/lib/utils"

export function DashboardContent() {
  const { data: meData, isLoading: meLoading } = useMe()
  const { data: stats, isLoading: statsLoading } = useMyStats()
  const { data: received } = useReceivedRequests()

  const [copied, setCopied] = useState(false)

  const userId = meData?.user?.userId
  const pendingCount = received?.length ?? 0

  // Find my stats from byPlayer
  const myStats = stats?.byPlayer.find((p) => p.userId === userId)

  async function copyUserId() {
    if (!userId) return
    await navigator.clipboard.writeText(userId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
          {meLoading ? (
            <Skeleton className="h-4 w-48 mt-1" />
          ) : userId ? (
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-muted-foreground">
                Votre ID :{" "}
                <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                  {userId}
                </span>
              </p>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={copyUserId}
                title="Copier l'ID"
              >
                {copied ? (
                  <Check className="h-3 w-3 text-green-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
          ) : null}
        </div>

        <Link href="/game/new" className={cn(buttonVariants({ size: "lg" }), "gap-2")}>
          <PlusCircle className="h-5 w-5" />
          Nouvelle partie
        </Link>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statsLoading ? (
          <>
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-24 rounded-lg" />
          </>
        ) : (
          <>
            <StatCard
              label="Parties jouées"
              value={myStats?.games ?? stats?.totalFinishedGames ?? 0}
              icon={Trophy}
            />
            <StatCard
              label="Score moyen"
              value={
                myStats ? formatScore(Math.round(myStats.averageScore)) : "—"
              }
              icon={BarChart2}
            />
            <StatCard
              label="Taux de victoire"
              value={myStats ? formatWinRate(myStats.winRate) : "—"}
              icon={Users}
            />
          </>
        )}
      </div>

      {/* Pending friend requests */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            Demandes d&apos;amis en attente
            {pendingCount > 0 && (
              <Badge variant="destructive" className="ml-1">
                {pendingCount}
              </Badge>
            )}
          </CardTitle>
          <Link href="/friends" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            Voir tout
          </Link>
        </CardHeader>
        <CardContent>
          {pendingCount === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aucune demande en attente.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Vous avez{" "}
              <strong className="text-foreground">{pendingCount}</strong>{" "}
              demande{pendingCount > 1 ? "s" : ""} d&apos;ami en attente.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

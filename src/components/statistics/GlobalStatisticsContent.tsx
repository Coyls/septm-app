"use client";

import { DateRangePicker } from "@/components/statistics/DateRangePicker";
import { StatCard } from "@/components/statistics/StatCard";
import { Competitiveness } from "@/components/statistics/charts/Competitiveness";
import { ExtensionImpact } from "@/components/statistics/charts/ExtensionImpact";
import { MonthlyTrend } from "@/components/statistics/charts/MonthlyTrend";
import { PlayerRankings } from "@/components/statistics/charts/PlayerRankings";
import { PointTypeDistribution } from "@/components/statistics/charts/PointTypeDistribution";
import { ScoreDistribution } from "@/components/statistics/charts/ScoreDistribution";
import { SidePerformance } from "@/components/statistics/charts/SidePerformance";
import { WonderPerformance } from "@/components/statistics/charts/WonderPerformance";
import { Skeleton } from "@/components/ui/skeleton";
import { useGlobalStats } from "@/lib/query/hooks/useStatistics";
import { Trophy } from "lucide-react";
import { useState } from "react";

export function GlobalStatisticsContent() {
  const [dateParams, setDateParams] = useState<{ from?: string; to?: string }>({});
  const { data, isLoading } = useGlobalStats(dateParams);

  return (
    <div className="w-full max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Statistiques globales</h1>
        <DateRangePicker onChange={setDateParams} />
      </div>

      {/*
        Mobile  : 1 col — chaque tuile prend toute la largeur (comportement par défaut)
        Desktop : grille bento 4 colonnes avec des spans variables
      */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

        {/* KPI — petite tuile */}
        <div className="lg:col-span-1 flex flex-col">
          {isLoading ? (
            <Skeleton className="h-full min-h-24 rounded-lg" />
          ) : (
            <StatCard
              label="Parties terminées"
              value={data?.totalFinishedGames ?? 0}
              icon={Trophy}
              className="h-full"
            />
          )}
        </div>

        {/* Classement joueurs — tuile large */}
        <div className="lg:col-span-3 [&>div]:h-full">
          <PlayerRankings data={data?.byPlayer} isLoading={isLoading} />
        </div>

        {/* Tendance mensuelle */}
        <div className="lg:col-span-2 [&>div]:h-full">
          <MonthlyTrend data={data?.trendByMonth} isLoading={isLoading} />
        </div>

        {/* Distribution des scores */}
        <div className="lg:col-span-2 [&>div]:h-full">
          <ScoreDistribution data={data?.scoreDistribution} isLoading={isLoading} />
        </div>

        {/* Performance par merveille */}
        <div className="lg:col-span-2 [&>div]:h-full">
          <WonderPerformance data={data?.wonderPerformance} isLoading={isLoading} />
        </div>

        {/* Performance par face */}
        <div className="lg:col-span-2 [&>div]:h-full">
          <SidePerformance data={data?.sidePerformance} isLoading={isLoading} />
        </div>

        {/* Répartition types de points */}
        <div className="lg:col-span-2 [&>div]:h-full">
          <PointTypeDistribution data={data?.pointTypeDistribution} isLoading={isLoading} />
        </div>

        {/* Impact des extensions */}
        <div className="lg:col-span-2 [&>div]:h-full">
          <ExtensionImpact data={data?.extensionImpact} isLoading={isLoading} />
        </div>

        {/* Compétitivité — tuile pleine largeur */}
        <div className="lg:col-span-4">
          <Competitiveness data={data?.competitiveness} isLoading={isLoading} />
        </div>

      </div>
    </div>
  );
}

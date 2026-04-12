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
import { WonderHighlights } from "@/components/statistics/charts/WonderHighlights";
import { WonderPerformance } from "@/components/statistics/charts/WonderPerformance";
import { Skeleton } from "@/components/ui/skeleton";
import { useGlobalStats, useMyStats } from "@/lib/query/hooks/useStatistics";
import { Trophy } from "lucide-react";
import { useState } from "react";

interface Props {
  mode: "global" | "me";
}

export function StatisticsContent({ mode }: Props) {
  const [dateParams, setDateParams] = useState<{ from?: string; to?: string }>({});

  const globalStats = useGlobalStats(dateParams);
  const meStats = useMyStats(dateParams);
  const { data, isLoading } = mode === "global" ? globalStats : meStats;

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold mb-1">
          {mode === "global" ? "Statistiques globales" : "Mes statistiques"}
        </h1>
        <DateRangePicker onChange={setDateParams} />
      </div>

      {mode === "me" && data && <WonderHighlights data={data} />}

      {isLoading ? (
        <Skeleton className="h-24 w-64 rounded-lg" />
      ) : (
        <StatCard label="Parties terminées" value={data?.totalFinishedGames ?? 0} icon={Trophy} className="max-w-xs" />
      )}

      <PlayerRankings data={data?.byPlayer} isLoading={isLoading} />
      <MonthlyTrend data={data?.trendByMonth} isLoading={isLoading} />
      <ScoreDistribution data={data?.scoreDistribution} isLoading={isLoading} />
      <WonderPerformance data={data?.wonderPerformance} isLoading={isLoading} />
      <SidePerformance data={data?.sidePerformance} isLoading={isLoading} />
      <PointTypeDistribution data={data?.pointTypeDistribution} isLoading={isLoading} />
      <ExtensionImpact data={data?.extensionImpact} isLoading={isLoading} />
      <Competitiveness data={data?.competitiveness} isLoading={isLoading} />
    </div>
  );
}

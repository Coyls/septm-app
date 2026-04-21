"use client";

import dynamic from "next/dynamic";
import { ExtensionImpact } from "@/components/statistics/charts/extension-impact";
import { PlayerRankings } from "@/components/statistics/charts/player-rankings";
import { WonderHighlights } from "@/components/statistics/charts/wonder-highlights";
import { WonderPerformance } from "@/components/statistics/charts/wonder-performance";
import { DateRangePicker } from "@/components/statistics/date-range-picker";

const MonthlyTrend = dynamic(
  () =>
    import("@/components/statistics/charts/monthly-trend").then(
      (m) => m.MonthlyTrend,
    ),
  { ssr: false },
);
const ScoreDistribution = dynamic(
  () =>
    import("@/components/statistics/charts/score-distribution").then(
      (m) => m.ScoreDistribution,
    ),
  { ssr: false },
);
const SidePerformance = dynamic(
  () =>
    import("@/components/statistics/charts/side-performance").then(
      (m) => m.SidePerformance,
    ),
  { ssr: false },
);
const PointTypeDistribution = dynamic(
  () =>
    import("@/components/statistics/charts/point-type-distribution").then(
      (m) => m.PointTypeDistribution,
    ),
  { ssr: false },
);
const Competitiveness = dynamic(
  () =>
    import("@/components/statistics/charts/competitiveness").then(
      (m) => m.Competitiveness,
    ),
  { ssr: false },
);
import { StatCard } from "@/components/statistics/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGlobalStats, useMyStats } from "@/lib/query/hooks/useStatistics";
import { Trophy } from "lucide-react";
import { useState } from "react";

interface Props {
  mode: "global" | "me";
}

export function StatisticsContent({ mode }: Props) {
  const [dateParams, setDateParams] = useState<{ from?: string; to?: string }>(
    {},
  );

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
        <StatCard
          label="Parties terminées"
          value={data?.totalFinishedGames ?? 0}
          icon={Trophy}
          className="max-w-xs"
        />
      )}

      <PlayerRankings data={data?.byPlayer} isLoading={isLoading} />
      <MonthlyTrend data={data?.trendByMonth} isLoading={isLoading} />
      <ScoreDistribution data={data?.scoreDistribution} isLoading={isLoading} />
      <WonderPerformance data={data?.wonderPerformance} isLoading={isLoading} />
      <SidePerformance data={data?.sidePerformance} isLoading={isLoading} />
      <PointTypeDistribution
        data={data?.pointTypeDistribution}
        isLoading={isLoading}
      />
      <ExtensionImpact data={data?.extensionImpact} isLoading={isLoading} />
      <Competitiveness data={data?.competitiveness} isLoading={isLoading} />
    </div>
  );
}

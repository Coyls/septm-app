"use client";

import { Competitiveness } from "@/components/statistics/charts/competitiveness";
import { ExtensionImpact } from "@/components/statistics/charts/extension-impact";
import { MonthlyTrend } from "@/components/statistics/charts/monthly-trend";
import { PointTypeDistribution } from "@/components/statistics/charts/point-type-distribution";
import { ScoreDistribution } from "@/components/statistics/charts/score-distribution";
import { SidePerformance } from "@/components/statistics/charts/side-performance";
import { WonderPerformance } from "@/components/statistics/charts/wonder-performance";
import { DateRangePicker } from "@/components/statistics/date-range-picker";
import { StatCard } from "@/components/statistics/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGlobalStats } from "@/lib/query/hooks/useStatistics";
import { Trophy } from "lucide-react";
import { useState } from "react";

export function GlobalStatisticsContent() {
  const [dateParams, setDateParams] = useState<{ from?: string; to?: string }>(
    {},
  );
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
        {/* Ligne 1 : KPI (1) + Tendance mensuelle (3) = 4 */}
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
        <div className="lg:col-span-3 [&>div]:h-full">
          <MonthlyTrend data={data?.trendByMonth} isLoading={isLoading} />
        </div>

        {/* Ligne 2 : Distribution des scores (2) + Performance par merveille (2) = 4 */}
        <div className="lg:col-span-2 [&>div]:h-full">
          <ScoreDistribution
            data={data?.scoreDistribution}
            isLoading={isLoading}
          />
        </div>
        <div className="lg:col-span-2 [&>div]:h-full">
          <WonderPerformance
            data={data?.wonderPerformance}
            isLoading={isLoading}
          />
        </div>

        {/* Ligne 3 : Performance par face (2) + Répartition types de points (2) = 4 */}
        <div className="lg:col-span-2 [&>div]:h-full">
          <SidePerformance data={data?.sidePerformance} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-2 [&>div]:h-full">
          <PointTypeDistribution
            data={data?.pointTypeDistribution}
            isLoading={isLoading}
          />
        </div>

        {/* Ligne 4 : Impact des extensions — pleine largeur */}
        <div className="lg:col-span-4">
          <ExtensionImpact data={data?.extensionImpact} isLoading={isLoading} />
        </div>

        {/* Ligne 5 : Compétitivité — pleine largeur */}
        <div className="lg:col-span-4">
          <Competitiveness data={data?.competitiveness} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
